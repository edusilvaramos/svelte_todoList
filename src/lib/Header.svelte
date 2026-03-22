<script>
  import { Link, useLocation, navigate } from "svelte-routing";
  import { user, logout } from './auth/authStore.js';
  import logo from '../assets/logo.svg';
  
  // the useLocation is a hook to get the current path for active link. returns a store
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

<nav class="navbar navbar-expand-lg bg-light paddingBody" data-bs-theme="light">
  <div class="container-fluid">
    <Link class="navbar-brand" to={$user ? '/home' : '/'}><img src={logo} alt="Do It Yourself logo" width="180"></Link>
    

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarColor03"
      aria-controls="navbarColor03"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarColor03">
      <ul class="navbar-nav me-auto">
        {#if $user}
          <li class="nav-item">
            <Link class="nav-link {$location.pathname === '/home' ? 'active' : ''}" to="/home">Accueil</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link {$location.pathname.startsWith('/profile') ? 'active' : ''}" to="/profile/{$user.id}">Profil</Link>
          </li>
        {/if}
      </ul>
      <div class="g-2 d-flex align-items-center gap-3">
        {#if $user}
          <span class="text-muted small">
            {$user.email}
          </span>
          <button 
            class="button delete"
            on:click={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'En train de se déconnecter..' : 'Se déconnecter'}
          </button>
        {:else}
          <Link to="/" class="button primary">
            Se connecter
          </Link>
          <Link to="/register" class="button secondary">
            Créer une compte
          </Link>
        {/if}
      </div>
    </div>
  </div>
</nav>
