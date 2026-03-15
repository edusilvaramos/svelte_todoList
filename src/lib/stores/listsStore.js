import { writable } from 'svelte/store';
import { loadLists, saveLists } from '../services/listsStorage.js';

const storedLists = loadLists();
const initialLists = storedLists;

function createListsStore() {
  // Expose a custom store API with persistence helpers.
  const { subscribe, update, set } = writable(initialLists);

  return {
    subscribe,

    addList(newList) {
      update((lists) => {
        // Prepend new lists so recent ones appear first.
        const updatedLists = [newList, ...lists];
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

    setLists(lists) {
      saveLists(lists);
      set(lists);
    }
  };
}

export const listsStore = createListsStore();