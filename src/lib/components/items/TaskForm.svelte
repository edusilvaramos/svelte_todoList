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

  let loadedTaskId = null;

  function resetForm() {
    title = "";
    notes = "";
    dueDate = "";
    dueTime = "";
    priority = "medium";
    status = "pending";
    recurrence = "none";
  }

  function fillForm(task) {
    title = task?.title ?? "";
    notes = task?.notes ?? "";
    dueDate = task?.dueDate ?? "";
    dueTime = task?.dueTime ?? "";
    priority = task?.priority ?? "medium";
    status = task?.status ?? "pending";
    recurrence = task?.recurrence ?? "none";
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
    
    dispatch("submit", {
      taskId: initialTask?.id ?? null,
      title: title.trim(),
      notes: notes.trim(),
      dueDate,
      dueTime,
      priority,
      status,
      recurrence,
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
    <h2 class="h5 mb-3">{isEditing ? "Edit task" : "Add a task"}</h2>

    <div class="mb-3">
      <label class="form-label" for="task-title">Title</label>
      <input
        id="task-title"
        class="form-control"
        type="text"
        bind:value={title}
        placeholder="Ex: Buy groceries"
      />
    </div>

    <div class="mb-3">
      <label class="form-label" for="task-notes">Notes</label>
      <textarea
        id="task-notes"
        class="form-control"
        rows="3"
        bind:value={notes}
        placeholder="Optional details"
      ></textarea>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-md-4">
        <label class="form-label" for="task-date">Due date</label>
        <input
          id="task-date"
          class="form-control"
          type="date"
          bind:value={dueDate}
        />
      </div>

      <div class="col-md-4">
        <label class="form-label" for="task-time">Due time</label>
        <input
          id="task-time"
          class="form-control"
          type="time"
          bind:value={dueTime}
        />
      </div>

      <div class="col-md-4">
        <label class="form-label" for="task-priority">Priority</label>
        <select id="task-priority" class="form-select" bind:value={priority}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label" for="task-status">Status</label>
        <select id="task-status" class="form-select" bind:value={status}>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="task-recurrence">Recurrence</label>
        <select id="task-recurrence" class="form-select" bind:value={recurrence}>
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button class="btn btn-primary" type="button" on:click={handleSubmit}>
        {isEditing ? "Save Task" : "Add Task"}
      </button>
      <button class="btn btn-outline-secondary" type="button" on:click={handleCancel}>
        Cancel
      </button>
    </div>
  </div>
</div>
