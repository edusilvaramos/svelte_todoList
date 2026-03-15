<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let newTitle = '';
  let newDescription = '';
  let newTags = '';

  // Build a list payload and emit it to the parent component.
  function handleSave() {
    if (!newTitle.trim()) return;

    const now = Date.now();

    // Convert comma-separated input into a clean tags array.
    const formattedTags = newTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newList = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      tags: formattedTags,
      createdAt: now,
      updatedAt: now,
      items: []
    };

    dispatch('save', newList);

    newTitle = '';
    newDescription = '';
    newTags = '';
  }

  // Notify the parent that the form was canceled.
  function handleCancel() {
    dispatch('cancel');
  }
</script>

<div class="card shadow-sm mb-4">
  <div class="card-body">
    <h2 class="h5 mb-3">New List</h2>

    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input
        id="title"
        class="form-control"
        type="text"
        bind:value={newTitle}
        placeholder="Example: Weekend tasks"
      />
    </div>

    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <textarea
        id="description"
        class="form-control"
        rows="3"
        bind:value={newDescription}
        placeholder="Write a short description"
      ></textarea>
    </div>

    <div class="mb-3">
      <label for="tags" class="form-label">Tags</label>
      <input
        id="tags"
        class="form-control"
        type="text"
        bind:value={newTags}
        placeholder="work, urgent, personal"
      />
      <div class="form-text">
        Separate tags with commas.
      </div>
    </div>

    <div class="d-flex gap-2">
      <button class="btn btn-primary" on:click={handleSave}>
        Save
      </button>
      <button class="btn btn-outline-secondary" on:click={handleCancel}>
        Cancel
      </button>
    </div>
  </div>
</div>