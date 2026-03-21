<script>
  import { createEventDispatcher } from "svelte";

  export let item;

  const dispatch = createEventDispatcher();

  function handleToggleDone(event) {
    dispatch("toggleDone", {
      taskId: item.id,
      done: event.currentTarget.checked,
    });
  }

  function handleDeleteTask() {
    dispatch("deleteTask", {
      taskId: item.id,
    });
  }

  function handleEditTask() {
    dispatch("editTask", {
      taskId: item.id,
    });
  }
</script>

<li class="list-group-item border-0 px-0 py-2">
  <div class="task-item card shadow-sm border-0">
    <div class="card-body">
      <div class="d-flex align-items-start gap-3">
        <input
          class="form-check-input task-check mt-1"
          type="checkbox"
          checked={item.done}
          on:change={handleToggleDone}
        />

        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <h3 class:item-done={item.done} class="h6 mb-1">
              {item.title}
            </h3>

            <div
              class="d-flex align-items-center gap-2 flex-wrap justify-content-end"
            >
              {#if item.priority}
                <span class="badge rounded-pill text-bg-light border">
                  {item.priority}
                </span>
              {/if}

              {#if item.recurrence && item.recurrence !== "none"}
                <span class="badge rounded-pill text-bg-light border">
                  {item.recurrence}
                </span>
              {/if}
            </div>
          </div>

          {#if item.notes}
            <p class:item-done={item.done} class="text-muted mb-2 small">
              {item.notes}
            </p>
          {/if}

          {#if item.status}
            <p class:item-done={item.done} class="text-muted mb-2 small">
              {item.status}
            </p>
          {/if}

          {#if item.dueDate || item.dueTime}
            <div class="text-muted small d-flex flex-wrap gap-2">
              {#if item.dueDate}
                <span>{item.dueDate}</span>
              {/if}

              {#if item.dueTime}
                <span>{item.dueTime}</span>
              {/if}
            </div>
          {/if}
        </div>
      </div>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary mt-3 me-2"
        on:click={handleEditTask}
      >
        Edit
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-danger mt-3"
        on:click={handleDeleteTask}
      >
        Delete
      </button>
    </div>
  </div>
</li>

<style>
  .task-item {
    border-radius: 18px;
  }

  .task-check {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
  }

  .item-done {
    text-decoration: line-through;
    opacity: 0.6;
  }
</style>
