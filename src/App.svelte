<script>
  import { Router, Route } from "svelte-routing";

  // pages
  import HomePage from "./pages/HomePage.svelte";
  import ListPage from "./pages/ListPage.svelte";
  import ProfilePage from "./pages/ProfilePage.svelte";
  // components
  import Header from "./lib/Header.svelte";
  import List from "./pages/List.svelte";
</script>

<!--  responsavel por gerenciar as rotas e randerizar os componentes -->
<Router>
  <Header />

  <main class="container py-4">
    <!-- pages -->
    <Route path="/" component={HomePage} />
    <Route path="/list" component={ListPage} />
    <!-- components -->
    <!-- vamos pasar o id da lista como parametro da rota -->
    <Route path="/list/:id" component={List} />
   
    <Route path="/profile/:id" component={ProfilePage} />
  </main>
</Router>
