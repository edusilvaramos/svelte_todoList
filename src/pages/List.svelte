<script>
  import { navigate } from "svelte-routing";
  import { listsStore } from "../lib/stores/listsStore.js";
  import TaskForm from "../lib/components/items/TaskForm.svelte";
  import TaskItem from "../lib/components/items/TaskItem.svelte";
  import CreateListForm from "../lib/components/lists/CreateListForm.svelte";
  import ListCard from "../lib/components/lists/ListCard.svelte";
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

  let showCreateForm = false;
  // Tracks which task is being edited; null means create mode.
  let editingTaskId = null;

  // Create or edit a task from form data and save it in the current list.
  function handleTaskSubmit(event) {
    const {
      taskId,
      title,
      notes,
      dueDate,
      dueTime,
      priority,
      status,
      recurrence,
    } = event.detail;

    if (taskId) {
      // Edit existing task using the same TaskForm payload.
      const updatedItems = currentList.items.map((item) => {
        if (item.type !== "task" || item.id !== taskId) {
          return item;
        }

        return {
          ...item,
          title,
          notes,
          dueDate,
          dueTime,
          priority,
          status,
          done: status === "done",
          recurrence,
        };
      });

      listsStore.updateList(currentList.id, {
        items: updatedItems,
      });
    } // Create mode: append a new task object to this list.
      else {
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

    showCreateForm = false;
    editingTaskId = null;
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

  // Remove one task from the current list.
  function handleDeleteTask(event) {
    const { taskId } = event.detail;

    listsStore.updateList(currentList.id, {
      items: currentList.items.filter(
        (item) => !(item.type === "task" && item.id === taskId),
      ),
    });
  }
// Opens TaskForm in edit mode with the selected task prefilled.
  
  function handleEditTask(event) {
    const { taskId } = event.detail;
    editingTaskId = taskId;
    showCreateForm = true;
  }

  function handleTaskFormCancel() {
    showCreateForm = false;
    editingTaskId = null;
  }

  $: editingTask =
    currentList?.items?.find(
      (item) => item.type === "task" && item.id === editingTaskId,
    ) ?? null;

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
// Tracks current list/sublist being edited with CreateListForm.
  
  let showCreateSubListForm = false;
  let editingListId = null;

  function startCreateTask() {
    editingTaskId = null;
    showCreateForm = true;
  }

  function startCreateSubList() {
    editingListId = null;
    showCreateSubListForm = true;
  }

  // Opens CreateListForm in edit mode for the current list header data.
  function handleEditCurrentList() {
    editingListId = currentList.id;
    showCreateSubListForm = true;
  }

  // Receives edit event from ListCard and reuses the same list form.
  function handleEditSubList(event) {
    const { listId } = event.detail;
    editingListId = listId;
    showCreateSubListForm = true;
  }

  function handleSubListFormCancel() {
    showCreateSubListForm = false;
    editingListId = null;
  }

  $: editingList =
    editingListId === currentList?.id
      ? currentList
      : (currentList?.items?.find(
          (item) => item.type === "list" && item.id === editingListId,
        ) ?? null);

  // Build a new sublist object and add it to this list.
  function handleSubListSave(event) {
    const listPayload = event.detail;

    if// Edit mode: update only editable list fields.
       (editingListId) {
      listsStore.updateList(editingListId, {
        title: listPayload.title,
        description: listPayload.description,
        tags: listPayload.tags,
      });
    } // Create mode: insert a new sublist into the current list items.
      else {
      const subList = {
        ...listPayload,
        type: "list",
        items: listPayload.items ?? [],
      };

      listsStore.updateList(currentList.id, {
        items: [...currentList.items, subList],
      });
    }

    showCreateSubListForm = false;
    editingListId = null;
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
      <div class="d-flex align-items-center justify-content-between gap-3">
        <h1 class="mb-2">{currentList.title}</h1>
        <button class="btn btn-sm btn-outline-secondary" on:click={handleEditCurrentList}>
          Edit List
        </button>
      </div>

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
            on:click={startCreateTask}
          >
            New Task
          </button>

          <button
            class="btn btn-outline-secondary"
            on:click={startCreateSubList}
          >
            New Sublist
          </button>

          {#if showCreateForm}
            <!-- `on:submit` listens to a custom event from TaskForm. -->
            <TaskForm
              initialTask={editingTask}
              isEditing={Boolean(editingTask)}
              on:submit={handleTaskSubmit}
              on:cancel={handleTaskFormCancel}
            />
          {/if}
          {#if showCreateSubListForm}
            <div class="mt-3">
              <!-- `on:save` and `on:cancel` are custom events from child component. -->
              <CreateListForm
                initialList={editingList}
                isEditing={Boolean(editingList)}
                on:save={handleSubListSave}
                on:cancel={handleSubListFormCancel}
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
                  <TaskItem
                    {item}
                    on:toggleDone={handleToggleTaskDone}
                    on:deleteTask={handleDeleteTask}
                    on:editTask={handleEditTask}
                  />
                {:else if item.type === "list"}
                  <ListCard list={item} on:edit={handleEditSubList} />
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
