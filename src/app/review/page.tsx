'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/discovery/BottomNav';
import { 
  SessionObject, 
  TrackSignal, 
  MemoryDecision,
  PastSession
} from '@/lib/discoveryTypes';
import { 
  getSession, 
  getTrackSignals, 
  clearSession, 
  saveMemoryDecision,
  savePastSession
} from '@/lib/discoveryStore';
import { MOCK_TRACKS } from '@/lib/mockTracks';

export default function ReviewPage() {
  const router = useRouter();
  
  const [session, setSession] = useState<SessionObject | null>(null);
  const [signals, setSignals] = useState<TrackSignal[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isIsolated, setIsIsolated] = useState(true);
  const [checkedTracks, setCheckedTracks] = useState<Set<string>>(new Set());
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [stats, setStats] = useState({ tracks: 0, artists: 0 });

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/');
      return;
    }
    
    const trackSignals = getTrackSignals();
    setSession(currentSession);
    setSignals(trackSignals);
    
    // Auto-check "loved" tracks
    const loved = trackSignals.filter(s => s.userSignal === 'love' || s.replayCount >= 2);
    setCheckedTracks(new Set(loved.map(s => s.trackId)));

    // Fetch AI Summary
    const fetchSummary = async () => {
      try {
        const payload = {
          intentTag: currentSession.intentTag,
          tracks: trackSignals.map(s => ({
            trackName: s.trackName,
            genre: s.genre,
            userSignal: s.userSignal
          }))
        };
        
        const res = await fetch('/api/session-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        setSummary(data.summary);
      } catch (e) {
        setSummary('You explored several new tracks in Discovery Mode tonight.');
      }
    };
    
    fetchSummary();
  }, [router]);

  const toggleTrack = (trackId: string) => {
    const next = new Set(checkedTracks);
    if (next.has(trackId)) next.delete(trackId);
    else next.add(trackId);
    setCheckedTracks(next);
  };

  const handleSave = () => {
    if (!session) return;
    
    const savedTracks = Array.from(checkedTracks);
    const artists = new Set(
      signals
        .filter(s => savedTracks.includes(s.trackId))
        .map(s => s.artist)
    );
    
    const savedArtists = Array.from(artists);
    
    // 1. Save memory decision
    const decision: MemoryDecision = {
      sessionId: session.sessionId,
      keptTracks: savedTracks,
      keptArtists: savedArtists,
      sessionIsolated: isIsolated,
      appliedAt: new Date().toISOString()
    };
    saveMemoryDecision(decision);
    
    // 2. Save for profile history
    const pastSession: PastSession = {
      sessionId: session.sessionId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      intentTag: session.intentTag,
      genreExplored: signals[0]?.genre || 'Mixed',
      artistsAdded: savedArtists,
      tracksSaved: savedTracks.length,
      undone: false
    };
    savePastSession(pastSession);
    
    // 3. Clear active session
    clearSession();
    
    // 4. Show confirmation
    setStats({ tracks: savedTracks.length, artists: savedArtists.length });
    setIsConfirmed(true);
    
    setTimeout(() => {
      router.push('/profile');
    }, 3000);
  };

  const handleIgnore = () => {
    clearSession();
    router.push('/');
  };

  if (!session) return null;

  if (isConfirmed) {
    return (
      <div className="review-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="review-confirmation">
          <div className="review-confirmation-icon">🎉</div>
          <h1 className="review-confirmation-title">Done!</h1>
          <p className="review-confirmation-details">
            {stats.artists} artists added · {stats.tracks} tracks saved<br/>
            {isIsolated ? 'Session kept separate' : 'Added to main taste profile'}
          </p>
        </div>
      </div>
    );
  }

  const lovedSignals = signals.filter(s => s.userSignal === 'love' || s.replayCount >= 2);
  const otherSignals = signals.filter(s => s.playDurationMs > 0 && s.userSignal !== 'love' && s.replayCount < 2);

  const renderTrackRow = (signal: TrackSignal) => {
    const mockTrack = MOCK_TRACKS.find(t => t.trackId === signal.trackId);
    const bg = mockTrack ? `linear-gradient(135deg, ${mockTrack.albumGradient[0]}, ${mockTrack.albumGradient[1]})` : '#333';
    
    return (
      <div key={signal.trackId} className="review-track">
        <button 
          className={`review-checkbox ${checkedTracks.has(signal.trackId) ? 'checked' : ''}`}
          onClick={() => toggleTrack(signal.trackId)}
        >
          ✓
        </button>
        <div className="review-track-art" style={{ background: bg }} />
        <div className="review-track-info">
          <div className="review-track-name">{signal.trackName}</div>
          <div className="review-track-meta">{signal.artist} · {signal.genre}</div>
        </div>
        <div className="review-track-signal">
          {signal.userSignal === 'love' ? '❤️' : signal.userSignal === 'okay' ? '👍' : signal.userSignal === 'dislike' ? '✗' : ''}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="review-page animate-fade-in">
        <div className={`review-summary ${!summary ? 'loading' : ''}`}>
          <div className="review-summary-icon">✨</div>
          <div className="review-summary-text">
            {summary || 'Analyzing session...'}
          </div>
        </div>

        {lovedSignals.length > 0 && (
          <div className="review-section">
            <h2 className="review-section-title">💚 You clearly loved these</h2>
            {lovedSignals.map(renderTrackRow)}
          </div>
        )}

        {otherSignals.length > 0 && (
          <div className="review-section">
            <h2 className="review-section-title">🤔 What about these?</h2>
            {otherSignals.map(renderTrackRow)}
          </div>
        )}

        {signals.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--sp-text-subdued)' }}>
            No tracks played long enough to review.
          </p>
        )}

        <div className="session-toggle">
          <div className="session-toggle-text">
            Keep this session separate from my main recommendations
          </div>
          <button 
            className={`toggle-switch ${isIsolated ? 'on' : ''}`}
            onClick={() => setIsIsolated(!isIsolated)}
          >
            <div className="toggle-switch-knob" />
          </button>
        </div>

        <div className="review-actions">
          <button className="btn-primary" onClick={handleSave}>
            Save my choices
          </button>
          <div>
            <button className="btn-secondary" onClick={handleIgnore}>
              Ignore everything from this session
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--sp-text-subdued)', marginTop: '8px' }}>
              Nothing is saved, and your algorithm pretends this never happened.
            </p>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </>
  );
}
