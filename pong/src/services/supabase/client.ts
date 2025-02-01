import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

/**
 * Sign in with Google OAuth
 * @returns Promise<AuthResponse>
 */
export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    const hostname = window.location.hostname;
    const protocol = hostname === 'localhost' ? 'http' : 'https';
    const port = hostname === 'localhost' ? ':3001' : '';
    const baseUrl = `${protocol}://${hostname}${port}`;
    const redirectUrl = `${baseUrl}/auth/v1/callback`;
    const siteUrl = baseUrl;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          site_url: siteUrl,
        },
      },
    });

    if (error) throw error;
    return { user: null, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { user: null, error: error as Error };
  }
};

/**
 * Sign out the current user
 * @returns Promise<{ error: Error | null }>
 */
export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error as Error };
  }
};

/**
 * Get the current user session
 * @returns Promise<AuthResponse>
 */
/**
 * Generate a random player name made of 3 words
 * @returns string
 */
const generateRandomPlayerName = (): string => {
  const adjectives = [
    'Swift',
    'Brave',
    'Mighty',
    'Silent',
    'Wise',
    'Fierce',
    'Noble',
    'Wild',
    'Bold',
    'Agile',
  ];
  const nouns = [
    'Warrior',
    'Knight',
    'Dragon',
    'Phoenix',
    'Tiger',
    'Eagle',
    'Wolf',
    'Lion',
    'Bear',
    'Hawk',
  ];
  const titles = [
    'Master',
    'Lord',
    'Champion',
    'Hunter',
    'Seeker',
    'Guardian',
    'Defender',
    'Slayer',
    'Runner',
    'Watcher',
  ];

  const randomWord = (array: string[]) =>
    array[Math.floor(Math.random() * array.length)];

  return `${randomWord(adjectives)}${randomWord(nouns)}${randomWord(titles)}`;
};

/**
 * Sign in anonymously with a random player name
 * @returns Promise<AuthResponse>
 */
export const signInAnonymously = async (): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    if (!data.user) throw new Error('Failed to create anonymous user');

    // Update the user's username in the users table
    const username = generateRandomPlayerName();
    const { error: updateError } = await supabase
      .from('users')
      .insert([{ id: data.user.id, username }]);

    if (updateError) throw updateError;

    // Update user metadata with the username
    await supabase.auth.updateUser({
      data: { username },
    });

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    return { user: null, error: error as Error };
  }
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return { user: null, error: null };
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error: error as Error };
  }
};
