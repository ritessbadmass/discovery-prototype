'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/discovery/BottomNav';
import { PastSession } from '@/lib/discoveryTypes';
import { getPastSessions, undoPastSession } from '@/lib/discoveryStore';
import { MOCK_PAST_SESSIONS, MOCK_TASTE_PROFILE, INTENT_OPTIONS } from '@/lib/mockTracks';

export default function ProfilePage() {
  const [sessions, setSessions] = useState<PastSession[]>([]);

  useEffect(() => {
    // Combine local storage sessions with mock data
    const local = getPastSessions();
    setSessions([...local, ...MOCK_PAST_SESSIONS]);
  }, []);

  const handleUndo = (sessionId: string) => {
    undoPastSession(sessionId);
    // Optimistic UI update
    setSessions(current => 
      current.map(s => s.sessionId === sessionId ? { ...s, undone: true } : s)
    );
  };

  const getEmoji = (tag: string) => {
    return INTENT_OPTIONS.find(opt => opt.tag === tag)?.emoji || '✨';
  };

  const formatIntent = (tag: string) => {
    const titles: Record<string, string> = {
      'somewhere-new': 'Somewhere new',
      'go-deeper': 'Go deeper',
      'rabbit-hole': 'Rabbit hole',
      'different-mood': 'Different mood'
    };
    return titles[tag] || 'Discovery';
  };

  return (
    <>
      <div className="profile-page animate-fade-in">
        <div className="profile-header">
          <h1>Taste Profile</h1>
          <p>What Spotify has learned from your Discovery sessions</p>
        </div>

        <div className="profile-section">
          <h2 className="profile-section-title">Past Discovery Sessions</h2>
          
          {sessions.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--sp-text-subdued)' }}>No sessions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sessions.map(session => (
                <div key={session.sessionId} className={`past-session-row ${session.undone ? 'undone' : ''}`}>
                  <div className="past-session-dot" style={{ background: session.undone ? 'var(--sp-surface-light)' : 'var(--sp-green)' }} />
                  <div className="past-session-info">
                    <div className="past-session-date">
                      {session.date} · {getEmoji(session.intentTag)} {formatIntent(session.intentTag)}
                    </div>
                    <div className="past-session-detail">
                      {session.genreExplored} · {session.tracksSaved} saved
                      {session.artistsAdded.length > 0 && ` · Added ${session.artistsAdded.join(', ')}`}
                    </div>
                  </div>
                  {!session.undone && (
                    <button 
                      className="past-session-undo"
                      onClick={() => handleUndo(session.sessionId)}
                    >
                      Undo
                    </button>
                  )}
                  {session.undone && (
                    <span style={{ fontSize: '11px', color: 'var(--sp-text-subdued)' }}>Undone</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2 className="profile-section-title">Your main taste profile</h2>
          
          <div className="genre-bars">
            {MOCK_TASTE_PROFILE.topGenres.map(genre => (
              <div key={genre.name} className="genre-bar-row">
                <div className="genre-bar-label">{genre.name}</div>
                <div className="genre-bar-track">
                  <div className="genre-bar-fill" style={{ width: `${genre.percentage}%` }} />
                </div>
                <div className="genre-bar-pct">{genre.percentage}%</div>
              </div>
            ))}
          </div>
          
          <h3 style={{ fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>Top Artists</h3>
          <div className="top-artists-list">
            {MOCK_TASTE_PROFILE.topArtists.map(artist => (
              <div key={artist} className="top-artist-chip">{artist}</div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h2 className="profile-section-title">Discovery Influence</h2>
          <div className="discovery-stats">
            <div className="discovery-stat">
              <div className="discovery-stat-value">+{MOCK_TASTE_PROFILE.discoveryInfluence.newGenresAdded}</div>
              <div className="discovery-stat-label">New genres</div>
            </div>
            <div className="discovery-stat">
              <div className="discovery-stat-value">+{MOCK_TASTE_PROFILE.discoveryInfluence.newArtistsAdded}</div>
              <div className="discovery-stat-label">New artists</div>
            </div>
            <div className="discovery-stat">
              <div className="discovery-stat-value">{MOCK_TASTE_PROFILE.discoveryInfluence.totalSessionsCompleted + sessions.filter(s => !s.undone && !s.sessionId.startsWith('past-')).length}</div>
              <div className="discovery-stat-label">Sessions</div>
            </div>
          </div>
        </div>
        
      </div>
      
      <BottomNav />
    </>
  );
}
