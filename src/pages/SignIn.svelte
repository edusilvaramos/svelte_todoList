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
        errorMessage = error.message || 'Error logging in. Please try again.';
      } else {
        navigate('/home');
      }
    } catch {
      errorMessage = 'Error connecting to server. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  async function handleForgotPassword() {
    errorMessage = '';
    infoMessage = '';

    if (!email) {
      errorMessage = 'Enter your email first to recover password.';
      return;
    }

    isLoading = true;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        errorMessage = error.message || 'Could not send reset email.';
      } else {
        infoMessage = 'Recovery email sent. Check your inbox.';
      }
    } catch {
      errorMessage = 'Error connecting to server. Please try again.';
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
          <h1 class="card-title text-center mb-2">Sign In</h1>
          <p class="text-center text-muted mb-4">Access your task account</p>

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
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                bind:value={email}
                placeholder="your@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div class="mb-4">
              <label for="password" class="form-label">Password</label>
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
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div class="d-flex align-items-center my-3">
            <hr class="flex-grow-1" />
            <span class="mx-3 text-muted">or</span>
            <hr class="flex-grow-1" />
          </div>

          <button
            type="button"
            class="btn btn-outline-secondary w-100 mb-3"
            on:click={navigateToRegister}
            disabled={isLoading}
          >
            Create a new account
          </button>
        </div>
      </div>
    </div>
  </div>
</div>