<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let title = "";
  let notes = "";
  let dueDate = "";
  let dueTime = "";
  let priority = "medium";
  let status = "pending";
  let recurrence = "none";

  function handleSubmit() {
    if (!title.trim()) return;

    dispatch("submit", {
      title: title.trim(),
      notes: notes.trim(),
      dueDate,
      dueTime,
      priority,
      status,
      recurrence,
    });

    title = "";
    notes = "";
    dueDate = "";
    dueTime = "";
    priority = "medium";
    status = "pending";
    recurrence = "none";
  }
</script>

<div class="card shadow-sm mt-4">
  <div class="card-body">
    <h2 class="h5 mb-3">Add a task</h2>

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

    <button class="btn btn-primary" type="button" on:click={handleSubmit}>
      Add Task
    </button>
  </div>
</div>
