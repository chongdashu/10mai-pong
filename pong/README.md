# 10m AI Gamedev Template

A starting point for creating browser-based games using AI assistance, powered by Phaser 3 and Supabase.

## Tech Stack

- Phaser 3 game framework
- TypeScript support
- Supabase authentication and database integration
- Vite for fast development and optimized builds
- PWA support
- ESLint and Prettier for code quality
- Hot module replacement during development

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase project (for backend services)

## Setup

1. Clone or copy this template
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run lint:check` - Check code for linting errors

## Documentation

- [Game Design Document](gdd.md)
- [Technical Design Document](technical-design.md)

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the contents of the `dist/` directory to your hosting service

## License

MIT
