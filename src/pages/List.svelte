<script>
  import { navigate } from 'svelte-routing';
  import { listsStore } from '../lib/stores/listsStore.js';

  export let id;

  $: currentList = $listsStore.find((list) => list.id === id);

  function goBack() {
    navigate('/home');
  }
</script>

<section class="py-4">
  <div class="container">
    <button class="btn btn-outline-secondary btn-sm mb-4" on:click={goBack}>
      Back to Home
    </button>

    {#if currentList}
      <h1 class="mb-2">{currentList.title}</h1>

      {#if currentList.description}
        <p class="text-muted">{currentList.description}</p>
      {/if}

      {#if currentList.tags?.length}
        <div class="d-flex flex-wrap gap-2 mt-3 mb-4">
          {#each currentList.tags as tag}
            <span class="badge bg-light text-dark border">{tag}</span>
          {/each}
        </div>
      {/if}

      <div class="card shadow-sm mt-4">
        <div class="card-body">
          <h2 class="h5 mb-3">Tasks</h2>

          {#if currentList.items.length === 0}
            <p class="text-muted mb-0">No tasks yet.</p>
          {:else}
            <ul class="list-group list-group-flush">
              {#each currentList.items as item}
                <li class="list-group-item px-0">
                  {item.title}
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    {:else}
      <h1 class="mb-2">List not found</h1>
      <p class="text-muted">No list matches this id.</p>
    {/if}
  </div>
</section>