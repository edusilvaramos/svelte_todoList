<script>
  import { Router, Route } from "svelte-routing";
  import { onMount } from 'svelte';
  import SignIn from "./pages/SignIn.svelte";
  import Register from "./pages/Register.svelte";
  import HomePage from "./pages/HomePage.svelte";
  import ProfilePage from "./pages/ProfilePage.svelte";
  import List from "./pages/List.svelte";
  import Header from "./lib/Header.svelte";
  import ProtectedRoute from "./lib/auth/ProtectedRoute.svelte";
  import { user, isLoading, initAuth } from "./lib/auth/authStore.js";

  // Initialize auth state as soon as the app is mounted.
  onMount(() => {
    initAuth();
  });
</script>

<Router>
  {#if !$isLoading}
    <Header />
  {/if}

  <main class="container py-4">
    {#if $isLoading}
      <div class="d-flex justify-content-center align-items-center" style="min-height: 60vh;">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    {:else}
      <Route path="/" component={SignIn} />
      <Route path="/register" component={Register} />

      <!-- Private pages are only accessible for authenticated users. -->
      <ProtectedRoute path="/home" component={HomePage} />
      <ProtectedRoute path="/list/:id" component={List} />
      <ProtectedRoute path="/profile/:id" component={ProfilePage} />
    {/if}
  </main>
</Router>
