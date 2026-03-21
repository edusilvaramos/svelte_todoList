import { writable } from "svelte/store";
import { loadDB, saveDB } from "../../services/localStorageService.js";


// Ensures each task has all required fields and correct types.
function normalizeTask(item) {
  return {
    ...item,
    type: "task",
    recurrence: item?.recurrence ?? "none",
    done: Boolean(item?.done),
    tags: Array.isArray(item?.tags) ? item.tags : [],
  };
}


// Ensures each list has required fields, valid dates, and normalizes all inner items.
function normalizeList(list) {
  const now = Date.now();

  return {
    ...list,
    type: "list",
    createdAt: Number.isFinite(list?.createdAt) ? list.createdAt : now,
    updatedAt: Number.isFinite(list?.updatedAt) ? list.updatedAt : now,
    tags: Array.isArray(list?.tags) ? list.tags : [],
    items: Array.isArray(list?.items) ? list.items.map(normalizeItem) : [],
  };
}


// Decides if the item is a list or a task and normalizes accordingly.
function normalizeItem(item) {
  if (item?.type === "list") {
    return normalizeList(item);
  }
  return normalizeTask(item);
}

// Update a list by id, even if it is inside another list.
function updateNestedList(list, targetId, changes) {
  if (list.id === targetId) {
    return normalizeList({
      ...list,
      ...changes,
      updatedAt: Date.now(),
    });
  }

  let hasChanged = false;

  const updatedItems = (list.items ?? []).map((item) => {
    if (item?.type !== "list") {
      return item;
    }

    const updatedChild = updateNestedList(item, targetId, changes);

    if (updatedChild !== item) {
      hasChanged = true;
    }

    return updatedChild;
  });

  if (!hasChanged) {
    return list;
  }

  return normalizeList({
    ...list,
    items: updatedItems,
    updatedAt: Date.now(),
  });
}

// Remove a list by id, even if it is nested.
function deleteNestedList(list, targetId) {
  let hasChanged = false;

  const updatedItems = [];

  for (const item of list.items ?? []) {
    if (item?.type !== "list") {
      updatedItems.push(item);
      continue;
    }

    if (item.id === targetId) {
      hasChanged = true;
      continue;
    }

    const updatedChild = deleteNestedList(item, targetId);

    if (updatedChild !== item) {
      hasChanged = true;
    }

    updatedItems.push(updatedChild);
  }

  if (!hasChanged) {
    return list;
  }

  return normalizeList({
    ...list,
    items: updatedItems,
    updatedAt: Date.now(),
  });
}

function persistLists(lists) {
  const currentDB = loadDB();
  saveDB({
    ...currentDB,
    lists,
  });
}

const initialDB = loadDB();
const initialLists = Array.isArray(initialDB?.lists)
  ? initialDB.lists.map(normalizeList)
  : [];

function createListsStore() {
  const { subscribe, update, set } = writable(initialLists);

  return {
    subscribe,

    // Add a new top-level list and save data.
    addList(newList) {
      update((lists) => {
        const updatedLists = [normalizeList(newList), ...lists];
        persistLists(updatedLists);
        return updatedLists;
      });
    },

    // Delete a list from top level or nested levels.
    deleteList(listId) {
      update((lists) => {
        let hasChanged = false;

        const rootFiltered = lists.filter((list) => {
          const keep = list.id !== listId;
          if (!keep) hasChanged = true;
          return keep;
        });

        const updatedLists = rootFiltered.map((list) => {
          const updatedList = deleteNestedList(list, listId);

          if (updatedList !== list) {
            hasChanged = true;
          }

          return updatedList;
        });

        if (!hasChanged) {
          return lists;
        }

        persistLists(updatedLists);
        return updatedLists;
      });
    },

    // Update a list from top level or nested levels.
    updateList(listId, changes) {
      update((lists) => {
        let hasChanged = false;

        const updatedLists = lists.map((list) => {
          const updatedList = updateNestedList(list, listId, changes);

          if (updatedList !== list) {
            hasChanged = true;
          }

          return updatedList;
        });

        if (!hasChanged) {
          return lists;
        }

        persistLists(updatedLists);
        return updatedLists;
      });
    },

    // Replace all lists after normalizing and save.
    setLists(lists) {
      const normalizedLists = lists.map(normalizeList);
      persistLists(normalizedLists);
      set(normalizedLists);
    },
  };
}

// Export a singleton store for app use.
export const listsStore = createListsStore();