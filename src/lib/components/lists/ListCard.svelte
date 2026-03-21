<script>
  import { createEventDispatcher } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { listsStore } from '../../stores/listsStore.js';

  export let list = {
    id: '',
    title: '',
    description: '',
    tags: []
  };

  const dispatch = createEventDispatcher();

  // Navigate to the details page for this list.
  function handleOpen() {
    navigate(`/list/${list.id}`);
  }

  // Confirm deletion to avoid accidental data loss.
  function handleDelete() {
    const confirmed = window.confirm(`Delete the list "${list.title}"?`);

    if (!confirmed) return;

    listsStore.deleteList(list.id);
  }

  // Ask parent page to open the shared list form in edit mode.
  function handleEdit() {
    dispatch('edit', { listId: list.id });
  }
</script>

<div class="card h-100 shadow-sm">
  <div class="card-body d-flex flex-column">
    <h5 class="card-title">{list.title}</h5>

    {#if list.description}
      <p class="card-text text-muted">
        {list.description}
      </p>
    {/if}

    {#if list.tags?.length}
      <div class="d-flex flex-wrap gap-2 mt-3 mb-3">
        {#each list.tags as tag}
          <span class="badge bg-light text-dark border">{tag}</span>
        {/each}
      </div>
    {/if}

    <div class="mt-auto d-flex gap-2">
      <button class="btn btn-primary btn-sm" on:click={handleOpen}>
        Open
      </button>

      <button class="btn btn-outline-secondary btn-sm" on:click={handleEdit}>
        Edit
      </button>

      <button class="btn btn-outline-danger btn-sm" on:click={handleDelete}>
        Delete
      </button>
    </div>
  </div>
</div>