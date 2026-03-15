const STORAGE_KEY = 'todo-lists';

export function loadLists() {
  // Read serialized lists from localStorage.
  const storedLists = localStorage.getItem(STORAGE_KEY);

  if (!storedLists) {
    return null;
  }

  try {
    return JSON.parse(storedLists);
  } catch (error) {
    console.error('Error while loading lists from localStorage:', error);
    return null;
  }
}

export function saveLists(lists) {
  try {
    // Persist the latest list snapshot.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (error) {
    console.error('Error while saving lists to localStorage:', error);
  }
}