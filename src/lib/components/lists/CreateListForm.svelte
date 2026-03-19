<script>
  import { createEventDispatcher } from "svelte";

  // Lets this child component send custom events to the parent.
  const dispatch = createEventDispatcher();

  let newTitle = "";
  let newDescription = "";
  let newTags = "";

  // Build a new list object and send it to the parent.
  function handleSave() {
    if (!newTitle.trim()) return;

    // Use the same time for createdAt and updatedAt.
    const now = Date.now();

    // Convert "a, b, c" text into ["a", "b", "c"].
    const formattedTags = newTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newList = {
      id: crypto.randomUUID(),
      type: "list",
      title: newTitle.trim(),
      description: newDescription.trim(),
      tags: formattedTags,
      createdAt: now,
      updatedAt: now,
      items: [],
    };

    dispatch("save", newList);

    // Clear form fields after save.
    newTitle = "";
    newDescription = "";
    newTags = "";
  }

  // Tell parent that user canceled.
  function handleCancel() {
    dispatch("cancel");
  }
</script>

<div class="card shadow-sm mb-4">
  <div class="card-body">
    <h2 class="h5 mb-3">New List</h2>

    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <!-- `bind:value` keeps input and variable in sync (2-way binding). -->
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
      <!-- This textarea also uses `bind:value` for 2-way binding. -->
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
      <div class="form-text">Separate tags with commas.</div>
    </div>

    <div class="d-flex gap-2">
      <button class="btn btn-primary" on:click={handleSave}> Save </button>
      <button class="btn btn-outline-secondary" on:click={handleCancel}>
        Cancel
      </button>
    </div>
  </div>
</div>
