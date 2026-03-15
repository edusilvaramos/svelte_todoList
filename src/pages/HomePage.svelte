<script>
  import ListGrid from '../lib/components/lists/ListGrid.svelte';
  import CreateListForm from '../lib/components/lists/CreateListForm.svelte';
  import { listsStore } from '../lib/stores/listsStore.js';

  let showCreateForm = false;

  // Show or hide the list creation form.
  function toggleCreateForm() {
    showCreateForm = !showCreateForm;
  }

  // Receive the new list from the form and persist it in the store.
  function handleCreateList(event) {
    const newList = event.detail;
    listsStore.addList(newList);
    showCreateForm = false;
  }

  // Close the form without creating a list.
  function handleCancelCreate() {
    showCreateForm = false;
  }
</script>

<section class="py-4">
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="mb-1">My Lists</h1>
        <p class="text-muted mb-0">Organize your tasks by list.</p>
      </div>

      <button class="btn btn-primary" on:click={toggleCreateForm}>
        Create List
      </button>
    </div>

    {#if showCreateForm}
      <CreateListForm
        on:save={handleCreateList}
        on:cancel={handleCancelCreate}
      />
    {/if}

    <!-- Reactive store value is passed down to render all list cards. -->
    <ListGrid lists={$listsStore} />
  </div>
</section>