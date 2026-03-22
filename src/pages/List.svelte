<script>
  import { navigate } from "svelte-routing";
  import { listsStore } from "../lib/stores/listsStore.js";
  import TaskForm from "../lib/components/task/TaskForm.svelte";
  import TaskItem from "../lib/components/task/TaskItem.svelte";
  import CreateListForm from "../lib/components/lists/CreateListForm.svelte";
  import ListCard from "../lib/components/lists/ListCard.svelte";
  import Breadcrumb from "../lib/components/navigation/Breadcrumb.svelte";
    import Search from "../lib/components/Search.svelte";

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
          priority: priority || "Low", // default
          status,
          done: status === "done",
          recurrence,
          tags: event.detail.tags || [],
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
          priority: priority || "Low", // default if missing
          status,
          done: status === "done",
          recurrence,
          type: "task",
          tags: event.detail.tags || [],
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

  let sortMode = "date"; // "date" | "priority"
  let hideDone = false;
  function getPriorityValue(item) {
    if (!item.priority) return 0;
    switch (item.priority) {
      case "high": return 3;
      case "medium": return 2;
      case "low": return 1;
      default: return 0;
    }
  }

  function filterItems(items, hideDoneFlag) {
    if (!items) return [];

    return items
      .map(item => {
        if (item.type === "list") {
          return {
            ...item,
            items: filterItems(item.items, hideDoneFlag),
          };
        }

        if (item.type === "task") {
          return !hideDoneFlag || !item.done ? item : null;
        }

        return item;
      })
      .filter(Boolean);
  }

  function sortItems(items, mode) {
    if (!items) return [];

    return items
      .map((item) => {
        // Recursively sort sublist items
        if (item.type === "list") {
          return { ...item, items: sortItems(item.items, mode) };
        }
        return item;
      })
      .sort((a, b) => {
        // Always keep lists and tasks together: optional, can change order
        if (a.type === "list" && b.type === "task") return -1; // lists first
        if (a.type === "task" && b.type === "list") return 1;

        // Compare tasks
        if (a.type === "task" && b.type === "task") {
          if (mode === "date") {
            const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0);
            const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0);
            return dateA - dateB; // earliest first
          }
          if (mode === "priority") {
            return getPriorityValue(b) - getPriorityValue(a); // High first
          }
        }
        return 0; // equal
      });
  }

  function getDisplayedItems(items, hideDoneFlag, sortModeFlag) {
  const filtered = filterItems(items, hideDoneFlag);
  return sortItems(filtered, sortModeFlag);
}


// Reactive displayed items
$: displayedItems = getDisplayedItems(currentList?.items || [], hideDone, sortMode);
</script>

<section>
  <div class="flex spaceBetween alignCenter">
    <Breadcrumb items={breadcrumbItems} />
    <button class="button outlineGray" on:click={goBack}>Retourner à l'accueil</button>
  </div>
  <Search />
  <div>
    <div>
      <div>
        <!-- `{#if ...}` renders this block only when condition is true. -->
        {#if currentList}
          <div class="flex spaceBetween alignCenter">
            <h1>{currentList.title}</h1>
            {#if currentList.tags?.length}
              <div>
                <!-- `{#each ...}` is Svelte loop syntax. -->
                {#each currentList.tags as tag}
                  <span class="tag secondary marginSides">{tag}</span>
                {/each}
              </div>
            {/if}
          </div>
          <br>
          {#if currentList.description}
            <p>{currentList.description}</p>
          {/if}
        {:else}
          <h1>List not found</h1>
          <p>No list matches this id.</p>
        {/if}
        <br>
        <button class="button outlineGray" on:click={handleEditCurrentList}>Modifier la liste</button>
      </div>
    </div>
    <div>
        <br>
        <h2>Tâches</h2>
        <br>
        <label class="flex alignCenter" style="margin-bottom: 1rem;">
          <input type="checkbox" bind:checked={hideDone} />
          <span style="margin-left: 0.5rem;">Masquer tâches finies</span>
        </label>
        <!-- Sort control -->
        <div class="flex alignCenter spaceBetween" style="margin-bottom: 1rem;">
          <span>Trier par:</span>
          <select bind:value={sortMode}>
            <option value="date">Date</option>
            <option value="priority">Priorité</option>
          </select>
        </div>

        <button class="button primary" on:click={startCreateTask}>Nouvelle tâche</button>
        <button class="button outlineAccent" on:click={startCreateSubList}>Nouvelle sous-liste</button>
        
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
          <div>
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
          <br><br>
          <p>Aucun article pour l'instant.</p>
        {:else}
          <div>
            {#each displayedItems as item (item.id)}
              {#if item.type === "task"}
                <!-- `{item}` passes prop with same name: item={item}. -->
                <br>
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
</section>

<style>

  input[type=checkbox] {
      /* Double-sized Checkboxes */
      -ms-transform: scale(1.5); /* IE */
      -moz-transform: scale(1.5); /* FF */
      -webkit-transform: scale(1.5); /* Safari and Chrome */
      -o-transform: scale(1.5); /* Opera */
      transform: scale(1.5);
      padding: 10px;
    }

  select {
    outline: none;
    padding: 8px;
    border-radius: 6px;
  }
  select:focus {
    border: 1px solid #5149D7;
    
  }
</style>