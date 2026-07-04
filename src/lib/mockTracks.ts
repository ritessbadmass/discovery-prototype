import { MockTrack, IntentOption } from './discoveryTypes';

export const MOCK_TRACKS: MockTrack[] = [
  {
    trackId: 'track-001',
    trackName: 'Midnight Frequencies',
    artist: 'Zaiden',
    genre: 'Indie Hip-Hop',
    subGenre: 'Lo-fi rap',
    durationMs: 234000,
    albumGradient: ['#1a1a2e', '#e94560'],
    year: 2024,
  },
  {
    trackId: 'track-002',
    trackName: 'Glass Ceiling',
    artist: 'Olivia Faye',
    genre: 'Alt-Pop',
    subGenre: 'Synth pop',
    durationMs: 198000,
    albumGradient: ['#0f3460', '#e94560'],
    year: 2025,
  },
  {
    trackId: 'track-003',
    trackName: 'Sturmfahrt',
    artist: 'Eisbrecher',
    genre: 'German Metal',
    subGenre: 'Neue Deutsche Härte',
    durationMs: 276000,
    albumGradient: ['#2d2d2d', '#c0392b'],
    year: 2023,
  },
  {
    trackId: 'track-004',
    trackName: 'Mazha Thulikal',
    artist: 'Priya Rajan',
    genre: 'Malayalam Pop',
    subGenre: 'Indie Malayalam',
    durationMs: 252000,
    albumGradient: ['#1b4332', '#d4a373'],
    year: 2024,
  },
  {
    trackId: 'track-005',
    trackName: 'Hill Country Revue',
    artist: 'Cedric Burnside',
    genre: 'Blues',
    subGenre: 'Hill country blues',
    durationMs: 312000,
    albumGradient: ['#3d2914', '#d4a574'],
    year: 2022,
  },
  {
    trackId: 'track-006',
    trackName: 'Two Fish and an Elephant',
    artist: 'Khruangbin',
    genre: 'Psychedelic',
    subGenre: 'Psychedelic funk',
    durationMs: 288000,
    albumGradient: ['#5b2c6f', '#f39c12'],
    year: 2024,
  },
  {
    trackId: 'track-007',
    trackName: 'Birthplace',
    artist: 'Novo Amor',
    genre: 'Indie Folk',
    subGenre: 'Ambient folk',
    durationMs: 222000,
    albumGradient: ['#1a3a3a', '#76c7c0'],
    year: 2023,
  },
  {
    trackId: 'track-008',
    trackName: 'Glowed Up',
    artist: 'Kaytranada',
    genre: 'Electronic Soul',
    subGenre: 'Future funk',
    durationMs: 264000,
    albumGradient: ['#0d0d0d', '#e056a0'],
    year: 2025,
  },
];

export const INTENT_OPTIONS: IntentOption[] = [
  {
    tag: 'somewhere-new',
    emoji: '🚀',
    title: 'Take me somewhere new',
    subtitle: 'Genres and artists you\'ve never heard',
  },
  {
    tag: 'go-deeper',
    emoji: '🔍',
    title: 'Stay close, go deeper',
    subtitle: 'Similar vibes, hidden gems nearby',
  },
  {
    tag: 'rabbit-hole',
    emoji: '🐇',
    title: 'Friend rec / random rabbit hole',
    subtitle: 'The unexpected playlist your friend would make',
  },
  {
    tag: 'different-mood',
    emoji: '🌙',
    title: 'Different mood today',
    subtitle: 'Break out of your current listening pattern',
  },
];

export const USER_GENRES = ['indie', 'hip-hop', 'alt-rock', 'electronic'];

// Mock home feed data
export const MOCK_RECENT_PLAYLISTS = [
  { id: 'rp-1', name: 'Liked Songs', subtitle: '342 songs', gradient: ['#4a148c', '#7b1fa2'], icon: '💚' },
  { id: 'rp-2', name: 'Chill Vibes', subtitle: 'Your playlist', gradient: ['#004d40', '#00796b'], icon: '☕' },
  { id: 'rp-3', name: 'Workout Mix', subtitle: 'Your playlist', gradient: ['#bf360c', '#e64a19'], icon: '💪' },
  { id: 'rp-4', name: 'Daily Mix 1', subtitle: 'Novo Amor, Bon Iver, Iron & Wine', gradient: ['#1a237e', '#283593'], icon: '✨' },
  { id: 'rp-5', name: 'Release Radar', subtitle: 'New music for you', gradient: ['#1b5e20', '#388e3c'], icon: '🔔' },
  { id: 'rp-6', name: 'Discover Weekly', subtitle: 'Made for you', gradient: ['#4e342e', '#6d4c41'], icon: '🎧' },
];

export const MOCK_DAILY_MIXES = [
  { id: 'dm-1', name: 'Daily Mix 1', artists: 'Novo Amor, Bon Iver, Phoebe Bridgers', gradient: ['#1a237e', '#5c6bc0'] },
  { id: 'dm-2', name: 'Daily Mix 2', artists: 'Kendrick Lamar, J. Cole, Tyler', gradient: ['#b71c1c', '#e53935'] },
  { id: 'dm-3', name: 'Daily Mix 3', artists: 'Khruangbin, Tame Impala, MGMT', gradient: ['#4a148c', '#ab47bc'] },
  { id: 'dm-4', name: 'Daily Mix 4', artists: 'Radiohead, The Strokes, Arctic Monkeys', gradient: ['#263238', '#546e7a'] },
];

export const MOCK_ON_REPEAT = [
  { id: 'or-1', name: 'Motion Sickness', artist: 'Phoebe Bridgers', gradient: ['#212121', '#616161'] },
  { id: 'or-2', name: 'Runaway', artist: 'AURORA', gradient: ['#1a237e', '#7986cb'] },
  { id: 'or-3', name: 'Heat Waves', artist: 'Glass Animals', gradient: ['#e65100', '#ff9800'] },
  { id: 'or-4', name: 'Bags', artist: 'Clairo', gradient: ['#880e4f', '#ec407a'] },
];

// Mock past sessions for taste profile
export const MOCK_PAST_SESSIONS = [
  {
    sessionId: 'past-001',
    date: 'June 28, 2026',
    intentTag: 'somewhere-new' as const,
    genreExplored: 'Indie Hip-Hop',
    artistsAdded: ['Zaiden'],
    tracksSaved: 3,
    undone: false,
  },
  {
    sessionId: 'past-002',
    date: 'June 25, 2026',
    intentTag: 'go-deeper' as const,
    genreExplored: 'Psychedelic Folk',
    artistsAdded: ['Novo Amor', 'Khruangbin'],
    tracksSaved: 5,
    undone: false,
  },
  {
    sessionId: 'past-003',
    date: 'June 20, 2026',
    intentTag: 'different-mood' as const,
    genreExplored: 'German Metal',
    artistsAdded: [],
    tracksSaved: 1,
    undone: false,
  },
];

// Mock taste profile data
export const MOCK_TASTE_PROFILE = {
  topGenres: [
    { name: 'Indie', percentage: 34 },
    { name: 'Hip-Hop', percentage: 22 },
    { name: 'Alt-Rock', percentage: 18 },
    { name: 'Electronic', percentage: 14 },
    { name: 'Folk', percentage: 8 },
    { name: 'Other', percentage: 4 },
  ],
  topArtists: [
    'Novo Amor',
    'Kendrick Lamar',
    'Tame Impala',
    'Phoebe Bridgers',
    'Bon Iver',
  ],
  discoveryInfluence: {
    newGenresAdded: 2,
    newArtistsAdded: 3,
    totalSessionsCompleted: 3,
  },
};
