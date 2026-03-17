const DEFAULT_PREFIX = "app:v1:";
let currentPrefix = DEFAULT_PREFIX;

// Current migration version — bump this to force cleanup on all clients
const MIGRATION_VERSION = 2;

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
 * Migration v2: removes any data that was incorrectly copied from unscoped
 * keys to other users, and cleans up unscoped data.
 */
export function setStoragePrefix(uid: string): void {
  const newPrefix = `app:v1:${uid}:`;
  if (currentPrefix === newPrefix) return;

  const oldKeys = buildKeys(DEFAULT_PREFIX);
  const newKeys = buildKeys(newPrefix);

  if (isClient()) {
    const migrationVersionKey = `${newPrefix}migration_v`;
    const currentVersion = parseInt(localStorage.getItem(migrationVersionKey) || "0", 10);

    if (currentVersion < MIGRATION_VERSION) {
      const keyPairs = Object.keys(oldKeys) as (keyof typeof oldKeys)[];

      if (currentVersion < 1) {
        // v1: Migrate unscoped data to this user (first user on this device only)
        for (const key of keyPairs) {
          const oldData = localStorage.getItem(oldKeys[key]);
          const newData = localStorage.getItem(newKeys[key]);
          if (oldData && !newData) {
            localStorage.setItem(newKeys[key], oldData);
          }
        }
      }

      if (currentVersion < 2) {
        // v2: Clean up unscoped data so it can't leak to other users.
        // Also remove data for users whose migrated flag exists but whose
        // data was copied from another user (cross-contamination fix).
        for (const key of keyPairs) {
          localStorage.removeItem(oldKeys[key]);
        }

        // If this user has NO data that they created themselves (i.e. the
        // data was only copied from unscoped keys by a previous buggy v1
        // migration), and another user already claimed the original data,
        // wipe this user's contaminated copy.
        const ownerKey = `${newPrefix}data_owner`;
        const globalOwner = localStorage.getItem("app:v1:data_owner");

        if (!localStorage.getItem(ownerKey)) {
          if (globalOwner && globalOwner !== uid) {
            // This user's data was copied from someone else — wipe it
            for (const key of keyPairs) {
              localStorage.removeItem(newKeys[key]);
            }
          }
          // Mark this user as the rightful owner of their data
          localStorage.setItem(ownerKey, uid);
          if (!globalOwner) {
            // First user to reach v2 claims the original data
            localStorage.setItem("app:v1:data_owner", uid);
          }
        }
      }

      localStorage.setItem(migrationVersionKey, String(MIGRATION_VERSION));
    }
  }

  currentPrefix = newPrefix;
  StorageKeys = buildKeys(newPrefix);
}

/**
 * Reset storage prefix back to default (used on logout).
 * Does NOT delete user data — just disconnects the current session.
 */
export function resetStoragePrefix(): void {
  currentPrefix = DEFAULT_PREFIX;
  StorageKeys = buildKeys(DEFAULT_PREFIX);
}

/**
 * Remove all data for the current user-scoped prefix.
 * Use with caution — this is a destructive operation.
 */
export function clearCurrentUserData(): void {
  if (!isClient()) return;
  const keys = StorageKeys;
  for (const key of Object.values(keys)) {
    localStorage.removeItem(key);
  }
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
