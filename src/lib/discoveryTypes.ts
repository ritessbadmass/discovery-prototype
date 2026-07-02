// Discovery Mode — Core Types

export type IntentTag =
  | 'somewhere-new'
  | 'go-deeper'
  | 'rabbit-hole'
  | 'different-mood';

export type AdventurenessLevel = 'safe' | 'balanced' | 'wild';

export type UserSignal = 'love' | 'okay' | 'dislike' | null;

export type SessionStatus = 'active' | 'reviewing' | 'completed' | 'discarded';

export interface MockTrack {
  trackId: string;
  trackName: string;
  artist: string;
  genre: string;
  subGenre?: string;
  durationMs: number;
  albumGradient: [string, string]; // CSS gradient colors
  year: number;
}

export interface TrackSignal {
  trackId: string;
  trackName: string;
  artist: string;
  genre: string;
  whySurfaced: string | null;
  userSignal: UserSignal;
  playDurationMs: number;
  replayed: boolean;
  replayCount: number;
  influenceTaste?: boolean;
}

export interface SessionObject {
  sessionId: string;
  intentTag: IntentTag;
  adventurenessLevel: AdventurenessLevel;
  tracks: TrackSignal[];
  aiSummary: string | null;
  status: SessionStatus;
  startedAt: string;
  endedAt: string | null;
}

export interface MemoryDecision {
  sessionId: string;
  keptTracks: string[];   // trackIds
  keptArtists: string[];  // artist names
  sessionIsolated: boolean;
  appliedAt: string;
}

export interface PastSession {
  sessionId: string;
  date: string;
  intentTag: IntentTag;
  genreExplored: string;
  artistsAdded: string[];
  tracksSaved: number;
  undone: boolean;
}

// API request/response types
export interface WhySurfacedRequest {
  intentTag: IntentTag;
  userGenres: string[];
  trackName: string;
  artist: string;
  genre: string;
}

export interface WhySurfacedResponse {
  label: string;
}

export interface SessionSummaryRequest {
  intentTag: IntentTag;
  tracks: {
    trackName: string;
    genre: string;
    userSignal: UserSignal;
  }[];
}

export interface SessionSummaryResponse {
  summary: string;
}

export interface IntentOption {
  tag: IntentTag;
  emoji: string;
  title: string;
  subtitle: string;
}
