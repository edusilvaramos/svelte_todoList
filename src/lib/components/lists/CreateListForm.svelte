<script>
  import { createEventDispatcher } from "svelte";

  // Same list form is reused to create a new list or edit an existing one.
  export let initialList = null;
  export let isEditing = false;

  // Lets this child component send custom events to the parent.
  const dispatch = createEventDispatcher();

  let newTitle = "";
  let newDescription = "";
  let newTags = "";
  let loadedListId = null;

  function resetForm() {
    newTitle = "";
    newDescription = "";
    newTags = "";
  }

  function fillForm(list) {
    newTitle = list?.title ?? "";
    newDescription = list?.description ?? "";
    newTags = Array.isArray(list?.tags) ? list.tags.join(", ") : "";
  }

  // When editing a different list, reload the fields with that list data.
  $: {
    const currentListId = initialList?.id ?? null;

    if (currentListId !== loadedListId) {
      loadedListId = currentListId;

      if (initialList) {
        fillForm(initialList);
      } else {
        resetForm();
      }
    }
  }

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
// Reuse id/items during edit; generate them only when creating.
    
    const listPayload = {
      id: initialList?.id ?? crypto.randomUUID(),
      type: "list",
      title: newTitle.trim(),
      description: newDescription.trim(),
      tags: formattedTags,
      createdAt: initialList?.createdAt ?? now,
      updatedAt: now,
      items: initialList?.items ?? [],
    };

    dispatch("save", listPayload);

    if (!isEditing) {
      resetForm();
    }
  }

  // Tell parent that user canceled.
  function handleCancel() {
    dispatch("cancel");
  }
</script>

<br>
<div class="card shadow-sm mb-4">
  <div class="card-body">
    <h2 class="h5 mb-3">{isEditing ? "Modifier la liste" : "Nouvelle liste"}</h2>

    <div class="mb-3">
      <label for="title" class="form-label">Titre</label>
      <!-- `bind:value` keeps input and variable in sync (2-way binding). -->
      <input
        id="title"
        class="form-control"
        type="text"
        bind:value={newTitle}
        placeholder="Ex : tâches du week-end"
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
        placeholder="Écrivez une courte description"
      ></textarea>
    </div>

    <div class="mb-3">
      <label for="tags" class="form-label">Tags</label>
      <input
        id="tags"
        class="form-control"
        type="text"
        bind:value={newTags}
        placeholder="travail, urgent, personnel"
      />
      <div class="form-text">Séparez les tags par des virgules.</div>
    </div>

    <div class="d-flex gap-2">
      <button class="button primary" on:click={handleSave}> Sauvegarder </button>
      <button class="button outlineGray" on:click={handleCancel}>
        Annuler
      </button>
    </div>
  </div>
</div>
