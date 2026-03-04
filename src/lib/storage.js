const KEY = "todoLists_v1";

export function loadLists() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("loadLists error:", err);
    return [];
  }
}

export function saveLists(lists) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lists));
  } catch (err) {
    console.error("saveLists error:", err);
  }
}

export function clearLists() {
  localStorage.removeItem(KEY);
}