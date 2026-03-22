import { derived, writable } from "svelte/store";
import { listsStore } from "./listsStore";

export const searchQuery = writable("");

function searchItems(items, query, path = [], parents = []) {
  const results = [];

  for (const item of items ?? []) {
    const newPath = [...path, item.title];

    // 👇 include current item in parents chain
    const newParents = [...parents, item.id];

    const matches =
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      (item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase())));

    if (matches) {
      results.push({
        ...item,
        path: newPath,
        parents: newParents, // 👈 now includes full chain (root → current)
        listId: newParents[0], // 👈 root list id (super useful)
      });
    }

    if (item.type === "list") {
      results.push(
        ...searchItems(
          item.items,
          query,
          newPath,
          newParents
        )
      );
    }
  }

  return results;
}

export const searchResults = derived(
  [listsStore, searchQuery],
  ([$lists, $query]) => {
    if (!$query) return [];

    return searchItems($lists, $query);
  }
);