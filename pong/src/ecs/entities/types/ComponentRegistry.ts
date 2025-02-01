/**
 * Registry of all component types in the game
 */
export const ComponentRegistry = {
  Transform: Symbol.for('Transform'),
  PlayerState: Symbol.for('PlayerState'),
  GridMovement: Symbol.for('GridMovement'),
  Sprite: Symbol.for('Sprite'),
  Score: Symbol.for('Score'),
} as const;

/**
 * Type for component keys
 */
export type ComponentKey = keyof typeof ComponentRegistry;
