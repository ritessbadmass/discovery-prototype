import {
  SessionObject,
  TrackSignal,
  MemoryDecision,
  PastSession,
  UserSignal,
} from './discoveryTypes';

// Storage keys
const KEYS = {
  SESSION: 'discovery_session',
  TRACK_SIGNALS: 'discovery_track_signals',
  MEMORY_DECISIONS: 'discovery_memory_decisions',
  WHY_SURFACED_CACHE: 'discovery_why_surfaced_cache',
  FIRST_VISIT: 'discovery_first_visit',
  PAST_SESSIONS: 'discovery_past_sessions',
} as const;

// Helpers
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

// Session
export function getSession(): SessionObject | null {
  return getItem<SessionObject | null>(KEYS.SESSION, null);
}

export function saveSession(session: SessionObject): void {
  setItem(KEYS.SESSION, session);
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.SESSION);
  localStorage.removeItem(KEYS.TRACK_SIGNALS);
}

export function createSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Track Signals
export function getTrackSignals(): TrackSignal[] {
  return getItem<TrackSignal[]>(KEYS.TRACK_SIGNALS, []);
}

export function saveTrackSignal(signal: TrackSignal): void {
  const signals = getTrackSignals();
  const idx = signals.findIndex((s) => s.trackId === signal.trackId);
  if (idx >= 0) {
    signals[idx] = signal;
  } else {
    signals.push(signal);
  }
  setItem(KEYS.TRACK_SIGNALS, signals);
}

export function updateTrackUserSignal(trackId: string, userSignal: UserSignal): void {
  const signals = getTrackSignals();
  const signal = signals.find((s) => s.trackId === trackId);
  if (signal) {
    signal.userSignal = userSignal;
    setItem(KEYS.TRACK_SIGNALS, signals);
  }
}

export function getTrackSignal(trackId: string): TrackSignal | undefined {
  return getTrackSignals().find((s) => s.trackId === trackId);
}

// Memory Decisions
export function getMemoryDecisions(): MemoryDecision[] {
  return getItem<MemoryDecision[]>(KEYS.MEMORY_DECISIONS, []);
}

export function saveMemoryDecision(decision: MemoryDecision): void {
  const decisions = getMemoryDecisions();
  decisions.push(decision);
  setItem(KEYS.MEMORY_DECISIONS, decisions);
}

// Why Surfaced Cache (keyed by trackId+intentTag)
export function getWhySurfacedCache(): Record<string, string> {
  return getItem<Record<string, string>>(KEYS.WHY_SURFACED_CACHE, {});
}

export function getCachedWhySurfaced(trackId: string, intentTag: string): string | null {
  const cache = getWhySurfacedCache();
  return cache[`${trackId}:${intentTag}`] || null;
}

export function cacheWhySurfaced(trackId: string, intentTag: string, label: string): void {
  const cache = getWhySurfacedCache();
  cache[`${trackId}:${intentTag}`] = label;
  setItem(KEYS.WHY_SURFACED_CACHE, cache);
}

// First Visit
export function isFirstVisit(): boolean {
  return getItem<boolean>(KEYS.FIRST_VISIT, true);
}

export function markVisited(): void {
  setItem(KEYS.FIRST_VISIT, false);
}

// Past Sessions
export function getPastSessions(): PastSession[] {
  return getItem<PastSession[]>(KEYS.PAST_SESSIONS, []);
}

export function savePastSession(session: PastSession): void {
  const sessions = getPastSessions();
  sessions.unshift(session);
  setItem(KEYS.PAST_SESSIONS, sessions);
}

export function undoPastSession(sessionId: string): void {
  const sessions = getPastSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (session) {
    session.undone = true;
    setItem(KEYS.PAST_SESSIONS, sessions);
  }
}
