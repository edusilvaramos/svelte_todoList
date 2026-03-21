# Svelte Todo List

A simple todo list application built with Svelte and Vite.

## Requirements

- Node.js 16 or later
- npm 7 or later

## Installation

1. Move into the project folder:

```bash
cd svelte_todoList
```

2. Install the dependencies:

```bash
npm install
```

## Environment Variables


## Environment Variables

This project uses Supabase for authentication and localStorage for offline persistence. Before starting the app, you must create an environment file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STORAGE_KEY=your_localstorage_key
```

ps: Go to supabase https://supabase.com
Create a Project, then go to Project Settings > API and copy the URL and anon key.

**VITE_STORAGE_KEY** is required and sets the key used for saving local app data in localStorage. There is no default value set in the code—you must define it in your `.env` file.

These variables are loaded from `.env` or `.env.local`.

## Build the application:
```bash
npm run build
```
## Start the development server:
```bash
npm run dev
```

Start the development server:

```bash
npm run dev
```

Vite will print the local URL in the terminal, usually `http://localhost:5173`.

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Authentication

This project uses Supabase Auth for:

- User registration
- Email and password sign-in
- Session management
- Logout
- Password reset flow

The application communicates with Supabase through the [Supabase JavaScript SDK](https://supabase.com/docs/reference/javascript/initializing).

Supabase handles password hashing and authentication flows securely, which keeps sensitive logic out of the client application.

For more details, see the [Supabase Auth documentation](https://supabase.com/docs/guides/auth).

## Documentation and References

- https://github.com/EmilTholin/svelte-routing
- https://svelte.dev/docs/svelte/overview
- https://bootswatch.com/litera/
- https://icons.getbootstrap.com
- https://github.com/sveltejs/svelte/issues/11021
- https://github.com/mefechoel/svelte-navigator?tab=readme-ov-file
- https://supabase.com/docs/reference/javascript/initializing
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

## Notes

This project uses `svelte-routing`, which works well with Svelte 4. For new projects built with Svelte 5, SvelteKit is generally the recommended routing solution.