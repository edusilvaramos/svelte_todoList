<script>
  import { Link } from "svelte-routing";
  export let id; // vem do /list/:id
</script>

<h1>Lista: {id}</h1>
<p>Aqui vamos editar os itens e sublistas.</p>

<Link to="/home">Voltar</Link>
