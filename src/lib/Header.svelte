<script>
  import { Link } from "svelte-routing";
</script>

<nav class="navbar navbar-expand-lg bg-light" data-bs-theme="light">
  <div class="container-fluid">
    <Link class="navbar-brand" to="/">nome e/ou brand</Link>
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
        <li class="nav-item">
          <Link class="nav-link active" to="/">Home</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/list">Lists to do</Link>
        </li>
      </ul>
      <div class="g-2">
        <Link to="/login" class="text-dark">
          <i class="bi bi-person-fill fs-2"></i>
        </Link>
        <!-- podemos mostrar a listas de users que o admon vai criar para atrubuir as taches-->
        <Link to="/registerPerson" class="text-dark">
          <i class="bi bi-people-fill fs-2"></i>
        </Link>
      </div>
    </div>
  </div>
</nav>
