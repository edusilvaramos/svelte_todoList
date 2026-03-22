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

  function countItems(list) {
  if (!list?.items) return 0;

  let count = 0;
  for (const item of list.items) {
    if (item.type === "task") {
      count += 1;
    } else if (item.type === "list") {
      count += 1 + countItems(item); // count the sublist itself + its items recursively
    }
  }
  return count;
}
</script>

<br>
<div class="itemCard">
  <div class="flex spaceBetween">
    <img alt="list icon" class="icon" src="/src/assets/listIcon.svg" /> 
    {#if list.tags?.length}
    <div>
      {#each list.tags as tag}
        <span class="tag secondary marginSides">{tag}</span>
      {/each}
    </div>
  {/if}   
  </div>
  <h3>{list.title}</h3>
  <span>{countItems(list)} items</span>

  {#if list.description}
    <p>{list.description}</p>
  {/if}

  
  <div class="buttons flex">
    <button class="button primary" on:click={handleOpen}>Ouvrir</button>
    <button class="button outlineGray" on:click={handleEdit}>Éditer</button>
    <button class="button delete" on:click={handleDelete}>Supprimer</button>
  </div>
</div>

<style>
.icon {
  background-color: #D3E5FE;
  padding: 6px;
  border-radius: 8px;
  margin-bottom: 32px;
}

.buttons {
  gap: 8px;
  margin-top: 12px;
}

</style>