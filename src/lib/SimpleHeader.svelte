<script>
  import { Link, useLocation, navigate } from "svelte-routing";
  import { user, logout } from './auth/authStore.js';
  
  const location = useLocation();
  let isLoggingOut = false;

  async function handleLogout() {
    isLoggingOut = true;
    try {
      const { error } = await logout();
      if (!error) {
        navigate('/');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      isLoggingOut = false;
    }
  }
</script>

<nav class="navbar navbar-expand-lg bg-light" data-bs-theme="light">
  <div class="container-fluid">
    <Link class="navbar-brand" to="/home">ToDo App</Link>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSimple"
      aria-controls="navbarSimple"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSimple">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <Link class="nav-link {$location.pathname === '/home' ? 'active' : ''}" to="/home">Accueil</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link {$location.pathname === '/list' ? 'active' : ''}" to="/list">Me Listes</Link>
        </li>
      </ul>
      <div class="d-flex align-items-center gap-2">
        {#if $user}
          <button 
            class="btn btn-outline-danger btn-sm"
            on:click={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'En train de se déconnecter..' : 'Se déconnecter'}
          </button>
        {/if}
      </div>
    </div>
  </div>
</nav>
