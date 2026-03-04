<script>
  import { Route, navigate } from "svelte-routing";
  import { user, isLoading } from './authStore.js';

  export let path;
  export let component;

  $: if (!$isLoading && !$user) {
    navigate('/', { replace: true });
  }
</script>

{#if $isLoading}
  <div class="d-flex justify-content-center align-items-center" style="min-height: 50vh;">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{:else if $user}
  <Route {path} {component} />
{/if}
