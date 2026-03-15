import { writable } from 'svelte/store';
import { loadLists, saveLists } from '../services/listsStorage.js';


function normalizeList(list) {
  const now = Date.now();
  let normalizedItems = [];

  if (Array.isArray(list?.items)) {
    normalizedItems = list.items;
  } else if (Array.isArray(list?.itens)) {
    normalizedItems = list.itens;
  }

  return {
    ...list,
    createdAt: Number.isFinite(list?.createdAt) ? list.createdAt : now,
    updatedAt: Number.isFinite(list?.updatedAt) ? list.updatedAt : now,
    items: normalizedItems
  };
}

function withUpdatedTimestamp(list, changes) {
  return {
    ...list,
    ...changes,
    updatedAt: Date.now()
  };
}

const storedLists = loadLists();
const initialLists = (storedLists).map(normalizeList);

function createListsStore() {
  // Expose a custom store API with persistence helpers.
  const { subscribe, update, set } = writable(initialLists);

  return {
    subscribe,

    addList(newList) {
      update((lists) => {
        // Prepend new lists so recent ones appear first.
        const updatedLists = [normalizeList(newList), ...lists];
        saveLists(updatedLists);
        return updatedLists;
      });
    },

    deleteList(listId) {
      update((lists) => {
        // Remove the selected list by id.
        const updatedLists = lists.filter((list) => list.id !== listId);
        saveLists(updatedLists);
        return updatedLists;
      });
    },

    updateList(listId, changes) {
      update((lists) => {
        // Keep createdAt and refresh updatedAt when list data changes.
        const updatedLists = lists.map((list) =>
          list.id === listId ? normalizeList(withUpdatedTimestamp(list, changes)) : list
        );
        saveLists(updatedLists);
        return updatedLists;
      });
    },

    setLists(lists) {
      const normalizedLists = lists.map(normalizeList);
      saveLists(normalizedLists);
      set(normalizedLists);
    }
  };
}

export const listsStore = createListsStore();