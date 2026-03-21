<script>
  import { navigate } from "svelte-routing";
  import { listsStore } from "../lib/stores/listsStore.js";
  import TaskForm from "../lib/components/items/TaskForm.svelte";
  import TaskItem from "../lib/components/items/TaskItem.svelte";
  import CreateListForm from "../lib/components/lists/CreateListForm.svelte";
  import ListCard from "../lib/components/lists/ListCard.svelte";
  import { Link } from "svelte-routing";
  import Breadcrumb from "../lib/components/navigation/Breadcrumb.svelte";

  // In Svelte, exported variables are props from the parent/router.
  export let id;

  // Find a list by id, including sublists inside other lists.
  function findPathToList(lists, targetId, currentPath = []) {
    for (const list of lists) {
      const newPath = [...currentPath, list];

      if (list.id === targetId) {
        return newPath;
      }

      const nestedLists = (list.items ?? []).filter(
        (item) => item?.type === "list",
      );
      const foundPath = findPathToList(nestedLists, targetId, newPath);

      if (foundPath) {
        return foundPath;
      }
    }

    return null;
  }

  // `$:`  reactive code: it runs again automatically when its values change. :) Svelte !!
  // `$listsStore` is Svelte auto-subscribe syntax: reads the current store value.
  // if the result is null, use an empty array instead.
  $: currentPath = findPathToList($listsStore, id) ?? [];

  // Get the last item of the path array = the list we are currently viewing.
  // if the array is empty, use null instead.
  $: currentList = currentPath[currentPath.length - 1] ?? null;

  function goBack() {
    navigate("/home");
  }

  // so breadcrumbItems is a flat list: [Home, parent list, current list].
  $: breadcrumbItems = [
    { label: "Home", href: "/home" },
    // puts all items from currentPath into the same array,
    ...currentPath.map((list) => ({
      label: list.title,
      href: `/list/${list.id}`,
    })),
  ];

  // Create a task from form data and add it to the current list.
  function handleTaskSubmit(event) {
    const { title, notes, dueDate, dueTime, priority, status, recurrence } =
      event.detail;

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

  // Mark task done/undone and create next task if it is recurring.
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

        if (!nextDueDate || nextDueDate === item.dueDate) {
          continue;
        }

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

  // Get the next date for daily/weekly/monthly recurrence.
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

  let showCreateSubListForm = false;

  function toggleCreateSubListForm() {
    showCreateSubListForm = !showCreateSubListForm;
  }

  // Build a new sublist object and add it to this list.
  function handleSubListSave(event) {
    const subList = {
      ...event.detail,
      type: "list",
      items: event.detail.items ?? [],
    };

    listsStore.updateList(currentList.id, {
      items: [...currentList.items, subList],
    });
    showCreateSubListForm = false;
  }
</script>

<section class="py-4">
  <Breadcrumb items={breadcrumbItems} />Breadcrumb
  <div class="container">
    <button class="btn btn-outline-secondary btn-sm mb-4" on:click={goBack}>
      Back to Home
    </button>

    <!-- `{#if ...}` renders this block only when condition is true. -->
    {#if currentList}
      <h1 class="mb-2">{currentList.title}</h1>

      {#if currentList.description}
        <p class="text-muted">{currentList.description}</p>
      {/if}

      {#if currentList.tags?.length}
        <div class="d-flex flex-wrap gap-2 mt-3 mb-4">
          <!-- `{#each ...}` is Svelte loop syntax. -->
          {#each currentList.tags as tag}
            <span class="badge bg-light text-dark border">{tag}</span>
          {/each}
        </div>
      {/if}

      <div class="card shadow-sm mt-4">
        <div class="card-body">
          <h2 class="h5 mb-3">Tasks</h2>
          <button
            class="btn btn-outline-primary me-2"
            on:click={toggleCreateForm}
          >
            New Task
          </button>

          <button
            class="btn btn-outline-secondary"
            on:click={toggleCreateSubListForm}
          >
            New Sublist
          </button>

          {#if showCreateForm}
            <!-- `on:submit` listens to a custom event from TaskForm. -->
            <TaskForm on:submit={handleTaskSubmit} />
          {/if}
          {#if showCreateSubListForm}
            <div class="mt-3">
              <!-- `on:save` and `on:cancel` are custom events from child component. -->
              <CreateListForm
                on:save={handleSubListSave}
                on:cancel={toggleCreateSubListForm}
              />
            </div>
          {/if}

          {#if currentList.items.length === 0}
            <p class="text-muted mb-0">No items yet.</p>
          {:else}
            <div class="mt-3 d-flex flex-column gap-3">
              {#each currentList.items as item (item.id)}
                {#if item.type === "task"}
                  <!-- `{item}` passes prop with same name: item={item}. -->
                  <TaskItem {item} on:toggleDone={handleToggleTaskDone} />
                {:else if item.type === "list"}
                  <ListCard list={item} />
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <h1 class="mb-2">List not found</h1>
      <p class="text-muted">No list matches this id.</p>
    {/if}
  </div>
</section>
