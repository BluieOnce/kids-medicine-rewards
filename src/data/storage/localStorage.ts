const DEFAULT_PREFIX = "app:v1:";
let currentPrefix = DEFAULT_PREFIX;

function buildKeys(prefix: string) {
  return {
    CHILDREN: `${prefix}children`,
    MEDICINES: `${prefix}medicines`,
    DOSES: `${prefix}doses`,
    REWARDS: `${prefix}rewards`,
    PET: `${prefix}pet`,
    REMINDERS: `${prefix}reminders`,
    GAME_SCORES: `${prefix}gameScores`,
  } as const;
}

export let StorageKeys = buildKeys(DEFAULT_PREFIX);

/**
 * Scope all storage keys by a user ID.
 * Also performs a one-time migration of unscoped data into the user-scoped keys.
 */
export function setStoragePrefix(uid: string): void {
  const newPrefix = `app:v1:${uid}:`;
  if (currentPrefix === newPrefix) return;

  const oldKeys = buildKeys(DEFAULT_PREFIX);
  const newKeys = buildKeys(newPrefix);

  // One-time migration: if user-scoped data doesn't exist yet but unscoped data does,
  // copy the unscoped data into the user-scoped keys
  if (isClient()) {
    const migrationFlag = `${newPrefix}migrated`;
    if (!localStorage.getItem(migrationFlag)) {
      const keyPairs = Object.keys(oldKeys) as (keyof typeof oldKeys)[];
      for (const key of keyPairs) {
        const oldData = localStorage.getItem(oldKeys[key]);
        const newData = localStorage.getItem(newKeys[key]);
        if (oldData && !newData) {
          localStorage.setItem(newKeys[key], oldData);
        }
      }
      // Clean up unscoped data so it won't be migrated to other users
      for (const key of keyPairs) {
        localStorage.removeItem(oldKeys[key]);
      }
      localStorage.setItem(migrationFlag, "true");
    }
  }

  currentPrefix = newPrefix;
  StorageKeys = buildKeys(newPrefix);
}

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
