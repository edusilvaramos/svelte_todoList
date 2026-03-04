# Svelte Todo List

A todo list application built with Svelte.

## Requirements

- **Node.js**: v16 or higher
- **npm**: v7 or higher

## Setup

1. Clone the repository or navigate to the project directory:
```bash
cd svelte_todoList
```

2. Install dependencies:
```bash
npm install
```

## Run the Application

Start the development server:
```bash
npm run dev
```


## Authentication

This project uses **Supabase Auth** for secure user authentication, including:
- User registration
- Login with email and password
- Session management
- Logout functionality
- forgot password flow

The Svelte application communicates with Supabase using the [Supabase JavaScript SDK](https://supabase.com/docs/reference/javascript/initializing).

**Why Supabase?**
Supabase provides secure password hashing, protected authentication flows, and email-based authentication without exposing sensitive data in the browser.

For more information, visit the [Supabase Auth documentation](https://supabase.com/docs/guides/auth).



## Documentation & References

- https://github.com/EmilTholin/svelte-routing
- https://svelte.dev/docs/svelte/overview
- https://bootswatch.com/litera/
- https://icons.getbootstrap.com
- https://github.com/sveltejs/svelte/issues/11021
- https://github.com/mefechoel/svelte-navigator?tab=readme-ov-file
- https://supabase.com/docs/reference/javascript/initializing
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

ps: svelte-routing works correctly with Svelte 4. For projects using Svelte 5, it is recommended to use SvelteKit, which is the official routing solution in the Svelte ecosystem.So we will use svelte-routing in this project, vertion 4.