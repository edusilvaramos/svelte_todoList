<script>
  import { navigate } from "svelte-routing";
  import { listsStore } from "../lib/stores/listsStore.js";
  import TaskForm from "../lib/components/items/TaskForm.svelte";
  import TaskItem from "../lib/components/items/TaskItem.svelte";


  export let id;
  
  //  bind:value keeps the input field and the title variable in sync automatically. 
  $: currentList = $listsStore.find((list) => list.id === id);

  function goBack() {
    navigate("/home");
  }

  function handleTaskSubmit(event) {
    const { title, notes, dueDate, dueTime, priority, status, recurrence } = event.detail;

    const newTask = {
      id: crypto.randomUUID(),
      title,
      notes,
      dueDate,
      dueTime,
      priority,
      status,
      done: status === "done",
      recurrence,
      type: "task",
    };

    listsStore.updateList(currentList.id, {
      items: [...currentList.items, newTask],
    });
  }

  function handleToggleTaskDone(event) {
    const { taskId, done } = event.detail;

    const updatedItems = [];

    for (const item of currentList.items) {
      if (item.id !== taskId) {
        updatedItems.push(item);
        continue;
      }

      const updatedTask = {
        ...item,
        done,
        status: done ? "done" : "pending",
      };

      updatedItems.push(updatedTask);

      if (done && item.recurrence && item.recurrence !== "none") {
        const nextDueDate = getNextDueDate(item.dueDate, item.recurrence);

        updatedItems.push({
          ...item,
          id: crypto.randomUUID(),
          done: false,
          status: "pending",
          dueDate: nextDueDate,
        });
      }
    }

    listsStore.updateList(currentList.id, {
      items: updatedItems,
    });
  }

  function getNextDueDate(dueDate, recurrence) {
    if (!dueDate) return "";

    const baseDate = new Date(`${dueDate}T00:00:00`);
    if (Number.isNaN(baseDate.getTime())) return dueDate;

    if (recurrence === "daily") {
      baseDate.setDate(baseDate.getDate() + 1);
    } else if (recurrence === "weekly") {
      baseDate.setDate(baseDate.getDate() + 7);
    } else if (recurrence === "monthly") {
      baseDate.setMonth(baseDate.getMonth() + 1);
    }

    return baseDate.toISOString().slice(0, 10);
  }

  let showCreateForm = false;

  function toggleCreateForm() {
    showCreateForm = !showCreateForm;
  }
</script>

<section class="py-4">
  <div class="container">
    <button class="btn btn-outline-secondary btn-sm mb-4" on:click={goBack}>
      Back to Home
    </button>

    {#if currentList}
      <h1 class="mb-2">{currentList.title}</h1>

      {#if currentList.description}
        <p class="text-muted">{currentList.description}</p>
      {/if}

      {#if currentList.tags?.length}
        <div class="d-flex flex-wrap gap-2 mt-3 mb-4">
          {#each currentList.tags as tag}
            <span class="badge bg-light text-dark border">{tag}</span>
          {/each}
        </div>
      {/if}

      <div class="card shadow-sm mt-4">
        <div class="card-body">
          <h2 class="h5 mb-3">Tasks</h2>
          <button class="btn btn-primary" on:click={toggleCreateForm}>
            Create Task
          </button>

          {#if showCreateForm}
            <TaskForm on:submit={handleTaskSubmit} />
          {/if}

          {#if currentList.items.length === 0}
            <p class="text-muted mb-0">No tasks yet.</p>
          {:else}
            <ul class="list-group list-group-flush">
              {#each currentList.items as item}
                <TaskItem {item} on:toggleDone={handleToggleTaskDone} />
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    {:else}
      <h1 class="mb-2">List not found</h1>
      <p class="text-muted">No list matches this id.</p>
    {/if}
  </div>
</section>
