<script>
  import ListGrid from '../lib/components/lists/ListGrid.svelte';
  import CreateListForm from '../lib/components/lists/CreateListForm.svelte';
  import { listsStore } from '../lib/stores/listsStore.js';

  let showCreateForm = false;
  // null = create mode, value = edit mode with shared CreateListForm.
  let editingListId = null;

  // Show or hide the list creation form.
  function toggleCreateForm() {
    if (!showCreateForm) {
      editingListId = null;
    }
    showCreateForm = !showCreateForm;
  }

  $: editingList =
    $listsStore.find((list) => list.id === editingListId) ?? null;

  // Receive list data from the shared form and persist create/edit changes.
  function handleCreateList(event) {
    const listPayload = event.detail;

    if (editingListId) {
      listsStore.updateList(editingListId, {
        title: listPayload.title,
        description: listPayload.description,
        tags: listPayload.tags,
      });
    } else {
      listsStore.addList(listPayload);
    }

    editingListId = null;
    showCreateForm = false;
  }

  // Close the form without creating a list.
  function handleCancelCreate() {
    editingListId = null;
    showCreateForm = false;
  }

  // Opens the same CreateListForm used by creation, now prefilled for edit.
  function handleEditList(event) {
    editingListId = event.detail.listId;
    showCreateForm = true;
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
        initialList={editingList}
        isEditing={Boolean(editingList)}
        on:save={handleCreateList}
        on:cancel={handleCancelCreate}
      />
    {/if}

    <!-- Reactive store value is passed down to render all list cards. -->
    <ListGrid lists={$listsStore} on:edit={handleEditList} />
  </div>
</section>