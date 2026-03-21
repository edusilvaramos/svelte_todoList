const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;
const STORAGE_VERSION = 1;

export function createEmptyDB() {
  // Default shape used when there is no valid saved data.
  return {
    lists: [],
    tags: [],
    version: STORAGE_VERSION
  };
}

export function loadDB() {
  try {
    // Try to load and validate persisted app data.
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyDB();

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return createEmptyDB();
    }

    return {
      lists: Array.isArray(parsed.lists) ? parsed.lists : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      version: Number.isInteger(parsed.version) ? parsed.version : STORAGE_VERSION
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return createEmptyDB();
  }
}

export function saveDB(db) {
  try {
    // Save full database object in one write operation.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function clearDB() {
  localStorage.removeItem(STORAGE_KEY);
}