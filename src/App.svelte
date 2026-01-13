<script>
    import CreateTask from "./lib/CreateTask.svelte";
  import Header from "./lib/Header.svelte";
    import TaskItem from "./lib/TaskItem.svelte";
</script>

<div>
  <Header />
</div>

<main>
  <h1>Faites toi meme</h1>
  <aside>
        
  </aside>
  <p>
    Check out <a
      href="https://github.com/sveltejs/kit#readme"
      target="_blank"
      rel="noreferrer">SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>
<CreateTask />
<TaskItem />