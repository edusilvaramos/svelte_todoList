<script>
  import ListGrid from '../lib/components/lists/ListGrid.svelte';
  import CreateListForm from '../lib/components/lists/CreateListForm.svelte';
  import { listsStore } from '../lib/stores/listsStore.js';
  import Search from '/src/lib/components/Search.svelte';

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

<Search />

<section>
  <div>
    <div class="flex spaceBetween alignCenter">
      <div>
        <h1>Mes listes</h1>
        <p>Organizez vos tâches par listes.</p>
      </div>

      <button class="button primary createButton" on:click={toggleCreateForm}>Créer liste</button>
    </div>
    <br>
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

<style>
.createButton {
  height: 48px;
}
</style>