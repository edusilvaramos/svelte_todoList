<script>
  import { supabase } from '../lib/auth/supabaseClient.js';
  import { navigate } from 'svelte-routing';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let isLoading = false;
  let errorMessage = '';

  async function handleRegister(e) {
    e.preventDefault();
    isLoading = true;
    errorMessage = '';

    if (!email || !password || !confirmPassword) {
      errorMessage = 'Please fill in all fields.';
      isLoading = false;
      return;
    }

    if (!email.includes('@')) {
      errorMessage = 'Please enter a valid email.';
      isLoading = false;
      return;
    }

    if (password.length < 6) {
      errorMessage = 'Password must be at least 6 characters.';
      isLoading = false;
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match.';
      isLoading = false;
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        errorMessage = error.message || 'Error creating account. Please try again.';
      } else {
        navigate('/');
      }
    } catch {
      errorMessage = 'Error connecting to server. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  function navigateToSignIn() {
    navigate('/');
  }
</script>

<div class="container mt-5 pt-5">
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-lg">
        <div class="card-body p-5">
          <h1 class="card-title text-center mb-2">Create Account</h1>
          <p class="text-center text-muted mb-4">Join us to manage your tasks</p>

          {#if errorMessage}
            <div class="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          {/if}

          <form on:submit={handleRegister}>
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

            <div class="mb-3">
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
              <small class="form-text text-muted">Minimum 6 characters</small>
            </div>

            <div class="mb-4">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                bind:value={confirmPassword}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
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
            on:click={navigateToSignIn}
            disabled={isLoading}
          >
            Already have an account
          </button>
        </div>
      </div>
    </div>
  </div>
</div>