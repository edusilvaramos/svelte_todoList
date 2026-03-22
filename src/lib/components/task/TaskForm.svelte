<script>
  import { createEventDispatcher } from "svelte";

  // Same form is used for create and edit flows.
  export let initialTask = null;
  export let isEditing = false;

  const dispatch = createEventDispatcher();

  let title = "";
  let notes = "";
  let dueDate = "";
  let dueTime = "";
  let priority = "medium";
  let status = "pending";
  let recurrence = "none";
  let tags = "";

  let loadedTaskId = null;

  function resetForm() {
    title = "";
    notes = "";
    dueDate = "";
    dueTime = "";
    priority = "medium";
    status = "pending";
    recurrence = "none";
    tags = "";
  }

  function fillForm(task) {
    title = task?.title ?? "";
    notes = task?.notes ?? "";
    dueDate = task?.dueDate ?? "";
    dueTime = task?.dueTime ?? "";
    priority = task?.priority ?? "medium";
    status = task?.status ?? "pending";
    recurrence = task?.recurrence ?? "none";
    tags = Array.isArray(task?.tags) ? task.tags.join(", ") : "";
  }

  // Refill form when user switches to edit another task.
  $: {
    const currentTaskId = initialTask?.id ?? null;

    if (currentTaskId !== loadedTaskId) {
      loadedTaskId = currentTaskId;

      if (initialTask) {
        fillForm(initialTask);
      } else {
        resetForm();
      }
    }
  }

  function handleSubmit() {
    if (!title.trim()) return;
    // Keep taskId in payload so parent can decide create vs update.
    
    const formattedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);


    dispatch("submit", {
      taskId: initialTask?.id ?? null,
      title: title.trim(),
      notes: notes.trim(),
      dueDate,
      dueTime,
      priority,
      status,
      recurrence,
      tags: formattedTags,
    });

    if (!isEditing) {
      resetForm();
    }
  }

  function handleCancel() {
    dispatch("cancel");
  }
</script>

<div class="card shadow-sm mt-4">
  <div class="card-body">
    <h2 class="h5 mb-3">{isEditing ? "Modifier tâche" : "Ajouter une tâche"}</h2>

    <div class="mb-3">
      <label class="form-label" for="task-title">Titre</label>
      <input
        id="task-title"
        class="form-control"
        type="text"
        bind:value={title}
        placeholder="Ex : Faire les courses"
      />
    </div>

    <div class="mb-3">
      <label class="form-label" for="task-notes">Notes</label>
      <textarea
        id="task-notes"
        class="form-control"
        rows="3"
        bind:value={notes}
        placeholder="Détails facultatifs"
      ></textarea>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-md-4">
        <label class="form-label" for="task-date">Date limite</label>
        <input
          id="task-date"
          class="form-control"
          type="date"
          bind:value={dueDate}
        />
      </div>

      <div class="col-md-4">
        <label class="form-label" for="task-time">Heure limite</label>
        <input
          id="task-time"
          class="form-control"
          type="time"
          bind:value={dueTime}
        />
      </div>

      <div class="col-md-4">
        <label class="form-label" for="task-priority">Priorité</label>
        <select id="task-priority" class="form-select" bind:value={priority}>
          <option value="Faible">Faible</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Haute">Haute</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label" for="task-status">Status</label>
        <select id="task-status" class="form-select" bind:value={status}>
          <option value="En attente">En attente</option>
          <option value="Faite">Faite</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="task-recurrence">Récurrence</label>
        <select id="task-recurrence" class="form-select" bind:value={recurrence}>
          <option value="Aucun">Aucun</option>
          <option value="Quotidien">Quotidien</option>
          <option value="Hebdomadaire">Hebdomadaire</option>
          <option value="Mensuel">Mensuel</option>
        </select>
      </div>
    </div>

    <div class="mb-3">
      <label for="tags" class="form-label">Tags</label>
      <input
        id="tags"
        class="form-control"
        type="text"
        bind:value={tags}
        placeholder="travail, urgent, personnel"
      />
      <div class="form-text">Séparez les tags par des virgules.</div>
    </div>

    <div class="d-flex gap-2">
      <button class="button primary" type="button" on:click={handleSubmit}>
        {isEditing ? "Enregistrer la tâche" : "Ajouter Tâche"}
      </button>
      <button class="button outlineGray" type="button" on:click={handleCancel}>
        Annuler
      </button>
    </div>
  </div>
</div>
