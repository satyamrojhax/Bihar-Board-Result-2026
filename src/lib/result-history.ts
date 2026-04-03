/* ------------------------------------------------------------------ */
/*  Result History - localStorage backed                                */
/* ------------------------------------------------------------------ */

export interface HistoryEntry {
  rollCode: string;
  rollNo: string;
  name: string;
  fatherName: string;
  schoolName: string;
  total: string;
  division: string;
  regNo: string;
  bsebId: string;
  timestamp: number;
}

const STORAGE_KEY = "bseb_result_history";
const MAX_ENTRIES = 20;

function isClient(): boolean {
  return typeof window !== "undefined";
}

/** Get all history entries, newest first */
export function getHistory(): HistoryEntry[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

/** Add a result to history (dedupes by rollCode+rollNo) */
export function addToHistory(entry: Omit<HistoryEntry, "timestamp">): void {
  if (!isClient()) return;
  const history = getHistory();
  // Remove existing entry with same rollCode+rollNo
  const filtered = history.filter(
    (h) => !(h.rollCode === entry.rollCode && h.rollNo === entry.rollNo)
  );
  // Prepend new entry
  filtered.unshift({ ...entry, timestamp: Date.now() });
  // Trim to max
  const trimmed = filtered.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/** Remove a single entry */
export function removeFromHistory(rollCode: string, rollNo: string): void {
  if (!isClient()) return;
  const history = getHistory().filter(
    (h) => !(h.rollCode === rollCode && h.rollNo === rollNo)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/** Clear all history */
export function clearHistory(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEY);
}
