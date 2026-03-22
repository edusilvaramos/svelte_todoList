<script>
  import { supabase } from '../lib/auth/supabaseClient.js';
  import { navigate } from 'svelte-routing';

  let email = '';
  let password = '';
  let isLoading = false;
  let errorMessage = '';
  let infoMessage = '';

  async function handleLogin(e) {
    e.preventDefault();
    isLoading = true;
    errorMessage = '';
    infoMessage = '';

    if (!email || !password) {
      errorMessage = 'Please fill in all fields.';
      isLoading = false;
      return;
    }

    if (!email.includes('@')) {
      errorMessage = 'Please enter a valid email.';
      isLoading = false;
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        errorMessage = error.message || 'Erreur lors de la connexion. Veuillez réessayer.';
      } else {
        navigate('/home');
      }
    } catch {
      errorMessage = 'Erreur lors de la connexion au serveur. Veuillez réessayer.';
    } finally {
      isLoading = false;
    }
  }

  async function handleForgotPassword() {
    errorMessage = '';
    infoMessage = '';

    if (!email) {
      errorMessage = 'Veuillez saisir votre courrier électronique pour récupérer votre mot de passe.';
      return;
    }

    isLoading = true;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        errorMessage = error.message || "Impossible d'envoyer le mail de réinitialisation.";
      } else {
        infoMessage = "Courriel de récupération envoyé. Veuillez consulter votre boîte de réception.";
      }
    } catch {
      errorMessage = "Erreur de connexion au serveur. Veuillez réessayer.";
    } finally {
      isLoading = false;
    }
  }

  function navigateToRegister() {
    navigate('/register');
  }
</script>

<div class="container mt-5 pt-5">
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-lg">
        <div class="card-body p-5">
          <h1 class="card-title text-center mb-2">Se connecter</h1>
          <p class="text-center text-muted mb-4">Accédez à votre compte de tâches</p>

          {#if errorMessage}
            <div class="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          {/if}

          {#if infoMessage}
            <div class="alert alert-info" role="alert">
              {infoMessage}
            </div>
          {/if}

          <form on:submit={handleLogin}>
            <div class="mb-3">
              <label for="email" class="form-label">Courriel</label>
              <input
                type="email"
                class="form-control"
                id="email"
                bind:value={email}
                placeholder="votre@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div class="mb-4">
              <label for="password" class="form-label">Mot de passe</label>
              <input
                type="password"
                class="form-control"
                id="password"
                bind:value={password}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              <div class="text-end mt-2">
                <button
                  type="button"
                  class="btn btn-link btn-sm p-0"
                  on:click={handleForgotPassword}
                  disabled={isLoading}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="button primary w-100"
              disabled={isLoading}
            >
              {isLoading ? 'En train de se connecter...' : 'Se connecter'}
            </button>
          </form>

          <div class="d-flex align-items-center my-3">
            <hr class="flex-grow-1" />
            <span class="mx-3 text-muted">ou</span>
            <hr class="flex-grow-1" />
          </div>

          <button
            type="button"
            class="button outlineGray w-100"
            on:click={navigateToRegister}
            disabled={isLoading}
          >
            Créer un nouvel compte
          </button>
        </div>
      </div>
    </div>
  </div>
</div>