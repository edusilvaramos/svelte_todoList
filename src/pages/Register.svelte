<script>
  import { supabase } from "../lib/auth/supabaseClient.js";
  import { navigate } from "svelte-routing";

  let email = "";
  let password = "";
  let confirmPassword = "";
  let isLoading = false;
  let errorMessage = "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getRegisterErrorMessage(error) {
    const errorText = (error?.message || "").toLowerCase();

    if (error?.status === 429 || errorText.includes("rate limit")) {
      return "Trop de tentatives d'inscription. Veuillez patienter quelques minutes avant de réessayer.";
    }

    if (errorText.includes("already registered") || errorText.includes("already been registered")) {
      return "Cet e-mail est déjà utilisé. Veuillez vous connecter.";
    }

    if (errorText.includes("is invalid") || errorText.includes("email address") && errorText.includes("invalid")) {
      return "Adresse e-mail invalide. Utilisez une adresse réelle, par exemple nom@domaine.com.";
    }

    return error?.message || "Erreur lors de la création du compte. Veuillez réessayer.";
  }

  async function handleRegister(e) {
    e.preventDefault();
    isLoading = true;
    errorMessage = "";
    const normalizedEmail = email.trim().toLowerCase();

    if (!email || !password || !confirmPassword) {
      errorMessage = 'Veuillez remplir tous les champs.';
      isLoading = false;
      return;
    }

    if (!email.includes('@')) {
      errorMessage = "Veuillez saisir une adresse e-mail valide.";
      isLoading = false;
      return;
    }

    if (password.length < 6) {
      errorMessage = "Le mot de passe doit comporter au moins 6 caractères.";
      isLoading = false;
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = "Les mots de passe ne correspondent pas.";
      isLoading = false;
      return;
    }

    try {
      const { error } = await supabase.auth.signUp(
        {
          email: normalizedEmail,
          password,
        },
        {
          emailRedirectTo: "http://localhost:5173/",
        },
      )

      if (error) {
        errorMessage = error.message || "Erreur lors de la création du compte. Veuillez réessayer.";
      } else {
        navigate("/");
      }
    } catch {
      errorMessage = "Erreur de connexion au serveur. Veuillez réessayer.";
    } finally {
      isLoading = false;
    }
  }

  function navigateToSignIn() {
    navigate("/");
  }
</script>

<div class="container mt-5 pt-5">
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-lg">
        <div class="card-body p-5">
          <h1 class="card-title text-center mb-2">Créer un compte</h1>
          <p class="text-center text-muted mb-4">Rejoignez-nous pour gérer vos tâches</p>

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
                placeholder="votre@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div class="mb-3">
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
              <small class="form-text text-muted">Minimum 6 caractères</small>
            </div>

            <div class="mb-4">
              <label for="confirmPassword" class="form-label">Confirmez le mot de passe</label>
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
              class="button primary w-100"
              disabled={isLoading}
            >
              {isLoading ? 'En train de créer le compte...' : 'Créer un compte'}
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
            on:click={navigateToSignIn}
            disabled={isLoading}
          >
            J'ai déjà un compte
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
