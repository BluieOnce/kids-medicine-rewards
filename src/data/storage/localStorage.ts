const STORAGE_PREFIX = "app:v1:";

export const StorageKeys = {
  CHILDREN: `${STORAGE_PREFIX}children`,
  MEDICINES: `${STORAGE_PREFIX}medicines`,
  DOSES: `${STORAGE_PREFIX}doses`,
  REWARDS: `${STORAGE_PREFIX}rewards`,
  PET: `${STORAGE_PREFIX}pet`,
  REMINDERS: `${STORAGE_PREFIX}reminders`,
  GAME_SCORES: `${STORAGE_PREFIX}gameScores`,
} as const;

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getItem<T>(key: string): T[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setItem<T>(key: string, data: T[]): void {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getSingleItem<T>(key: string): T | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSingleItem<T>(key: string, data: T): void {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(data));
}
