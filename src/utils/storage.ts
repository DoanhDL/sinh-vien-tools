import type { TestResult, VocabProgress } from "../types/toeic";

const TEST_HISTORY_KEY = "toeic_test_history";
const VOCAB_PROGRESS_KEY = "toeic_vocab_progress";
const DEVICE_ID_KEY = "toeic_device_id";

const API_BASE = "/api";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

async function apiFetch(path: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function initBackendSync(): Promise<void> {
  const deviceId = getDeviceId();
  await apiFetch("/users/register", {
    method: "POST",
    body: JSON.stringify({ deviceId }),
  });

  const localHistory = getTestHistory();
  const localVocab = getVocabProgress();

  const synced = await apiFetch(`/sync/${deviceId}`, {
    method: "POST",
    body: JSON.stringify({ testHistory: localHistory, vocabProgress: localVocab }),
  });

  if (synced) {
    localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(synced.testHistory ?? []));
    localStorage.setItem(VOCAB_PROGRESS_KEY, JSON.stringify(synced.vocabProgress ?? {}));
  }
}

export function getTestHistory(): TestResult[] {
  return safeParse(localStorage.getItem(TEST_HISTORY_KEY), []);
}

export async function saveTestResult(result: TestResult): Promise<void> {
  const history = getTestHistory();
  history.unshift(result);
  localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(history));

  const deviceId = getDeviceId();
  await apiFetch(`/progress/${deviceId}/test-history`, {
    method: "POST",
    body: JSON.stringify(result),
  });
}

export function getVocabProgress(): Record<string, VocabProgress> {
  return safeParse(localStorage.getItem(VOCAB_PROGRESS_KEY), {});
}

function saveVocabProgressLocal(progress: Record<string, VocabProgress>): void {
  localStorage.setItem(VOCAB_PROGRESS_KEY, JSON.stringify(progress));
}

export async function updateVocabCardProgress(
  cardId: string,
  masteryLevel: VocabProgress["masteryLevel"],
): Promise<VocabProgress> {
  const all = getVocabProgress();
  const existing = all[cardId];
  const updated: VocabProgress = {
    cardId,
    reviewCount: (existing?.reviewCount ?? 0) + 1,
    lastReviewedAt: new Date().toISOString(),
    masteryLevel,
  };
  all[cardId] = updated;
  saveVocabProgressLocal(all);

  const deviceId = getDeviceId();
  await apiFetch(`/progress/${deviceId}/vocab/${cardId}`, {
    method: "PUT",
    body: JSON.stringify(updated),
  });

  return updated;
}

export async function fetchTestHistoryFromServer(): Promise<TestResult[]> {
  const deviceId = getDeviceId();
  const data = await apiFetch(`/progress/${deviceId}/test-history`);
  if (data) {
    localStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(data));
    return data as TestResult[];
  }
  return getTestHistory();
}

export function clearTestHistory(): void {
  localStorage.removeItem(TEST_HISTORY_KEY);
}

export function clearVocabProgress(): void {
  localStorage.removeItem(VOCAB_PROGRESS_KEY);
}
