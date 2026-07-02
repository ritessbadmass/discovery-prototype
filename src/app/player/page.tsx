'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  SessionObject, 
  TrackSignal, 
  UserSignal,
  AdventurenessLevel
} from '@/lib/discoveryTypes';
import { 
  getSession, 
  saveSession, 
  saveTrackSignal, 
  getTrackSignal,
  getCachedWhySurfaced,
  cacheWhySurfaced
} from '@/lib/discoveryStore';
import { MOCK_TRACKS, USER_GENRES } from '@/lib/mockTracks';

export default function PlayerPage() {
  const router = useRouter();
  
  const [session, setSession] = useState<SessionObject | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [whySurfaced, setWhySurfaced] = useState<string | null>(null);
  const [isLoadingWhy, setIsLoadingWhy] = useState(false);
  const [userSignal, setUserSignal] = useState<UserSignal>(null);
  const [showQueue, setShowQueue] = useState(false);
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [tempAdventureness, setTempAdventureness] = useState<AdventurenessLevel>('balanced');
  
  // Love Modal State
  const [showLoveModal, setShowLoveModal] = useState(false);
  const [savedToLiked, setSavedToLiked] = useState(false);
  const [impactRecommendations, setImpactRecommendations] = useState(false);
  
  const track = MOCK_TRACKS[trackIndex];
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(Date.now());

  // Init session
  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/activate');
      return;
    }
    setSession(currentSession);
    setTempAdventureness(currentSession.adventurenessLevel);
  }, [router]);

  // Handle track change
  useEffect(() => {
    if (!session || !track) return;
    
    // Reset state for new track
    setProgress(0);
    startTime.current = Date.now();
    
    // Restore signal if exists
    const existingSignal = getTrackSignal(track.trackId);
    setUserSignal(existingSignal?.userSignal || null);
    
    // Fetch why surfaced
    const fetchWhySurfaced = async () => {
      setIsLoadingWhy(true);
      const cached = getCachedWhySurfaced(track.trackId, session.intentTag);
      
      if (cached) {
        setWhySurfaced(cached);
        setIsLoadingWhy(false);
        return;
      }
      
      try {
        const res = await fetch('/api/why-surfaced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            intentTag: session.intentTag,
            userGenres: USER_GENRES,
            trackName: track.trackName,
            artist: track.artist,
            genre: track.genre
          })
        });
        const data = await res.json();
        const label = data.label || 'Curated for you';
        setWhySurfaced(label);
        cacheWhySurfaced(track.trackId, session.intentTag, label);
      } catch (e) {
        setWhySurfaced('Curated for you');
      } finally {
        setIsLoadingWhy(false);
      }
    };
    
    fetchWhySurfaced();
  }, [trackIndex, session, track]);

  // Handle progress
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            handleNext();
            return 0;
          }
          return p + (100 / 30); // Complete in 30 seconds for simulation
        });
      }, 1000);
    }
    
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, trackIndex]);

  // Track signal saving
  const handleSignal = (signal: UserSignal) => {
    const newSignal = userSignal === signal ? null : signal;
    setUserSignal(newSignal);
    
    if (track) {
      const playDurationMs = Date.now() - startTime.current;
      const existing = getTrackSignal(track.trackId);
      
      const trackSignal: TrackSignal = {
        trackId: track.trackId,
        trackName: track.trackName,
        artist: track.artist,
        genre: track.genre,
        whySurfaced,
        userSignal: newSignal,
        playDurationMs: (existing?.playDurationMs || 0) + playDurationMs,
        replayed: !!existing,
        replayCount: (existing?.replayCount || 0) + (existing ? 1 : 0),
        influenceTaste: existing?.influenceTaste || false
      };
      
      saveTrackSignal(trackSignal);

      if (newSignal === 'love') {
        setShowLoveModal(true);
        setSavedToLiked(false);
        setImpactRecommendations(false);
      }
    }
  };

  const handleLoveModalDone = () => {
    setShowLoveModal(false);
    if (track) {
      const existing = getTrackSignal(track.trackId);
      if (existing) {
        existing.influenceTaste = impactRecommendations;
        saveTrackSignal(existing);
      }
    }
  };

  const handleNext = () => {
    // Save current track signal implicitly on skip
    if (userSignal === null) handleSignal(null);
    setTrackIndex(i => (i + 1) % MOCK_TRACKS.length);
  };
  
  const handlePrev = () => {
    setTrackIndex(i => i === 0 ? MOCK_TRACKS.length - 1 : i - 1);
  };

  const handleEndSession = () => {
    // Save current before leaving
    if (userSignal === null) handleSignal(null);
    
    if (session) {
      const updated = { ...session, endedAt: new Date().toISOString() };
      saveSession(updated);
    }
    router.push('/review');
  };

  const handleApplyDirection = () => {
    if (session) {
      const updated = { ...session, adventurenessLevel: tempAdventureness };
      saveSession(updated);
      setSession(updated);
    }
    setShowSliderModal(false);
  };

  const formatTime = (pct: number) => {
    if (!track) return '0:00';
    const ms = (pct / 100) * track.durationMs;
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session || !track) return null;

  return (
    <div className="player-page animate-fade-in">
      <div className="player-header">
        <div className="player-header-left">PLAYING FROM DISCOVERY</div>
        <div className="discovery-badge">🧭 Discovery Mode</div>
      </div>

      <div 
        className="player-album-art"
        style={{ background: `linear-gradient(135deg, ${track.albumGradient[0]}, ${track.albumGradient[1]})` }}
      />

      <div className="player-track-info">
        <h2 className="player-track-name">{track.trackName}</h2>
        <div className="player-artist">{track.artist}</div>
        <div className={`player-why-surfaced ${isLoadingWhy ? 'loading' : ''}`}>
          {isLoadingWhy ? 'Analyzing...' : whySurfaced}
        </div>
      </div>

      <div className="player-progress">
        <div className="progress-bar" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          setProgress(pct);
        }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-times">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(100)}</span>
        </div>
      </div>

      <div className="player-controls">
        <button className="control-btn" onClick={handlePrev}>⏮</button>
        <button className="control-btn play-btn" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="control-btn" onClick={handleNext}>⏭</button>
      </div>

      <div className="action-strip">
        <button 
          className={`action-btn ${userSignal === 'dislike' ? 'active-dislike' : ''}`}
          onClick={() => handleSignal('dislike')}
        >
          <span className="action-btn-icon">✗</span>
          <span>Not for me</span>
        </button>
        <button 
          className={`action-btn ${userSignal === 'okay' ? 'active-okay' : ''}`}
          onClick={() => handleSignal('okay')}
        >
          <span className="action-btn-icon">👍</span>
          <span>It's okay</span>
        </button>
        <button 
          className={`action-btn ${userSignal === 'love' ? 'active-love' : ''}`}
          onClick={() => handleSignal('love')}
        >
          <span className="action-btn-icon">❤️</span>
          <span>Love this</span>
        </button>
      </div>

      <div className="queue-toggle">
        <button className="queue-toggle-btn" onClick={() => setShowQueue(!showQueue)}>
          Queue {showQueue ? '▼' : '▲'}
        </button>
      </div>
      
      <div style={{ padding: '0 16px 24px 16px' }}>
        <button className="end-session-btn" onClick={handleEndSession}>
          End session
        </button>
      </div>

      {showQueue && (
        <div className="queue-panel">
          <div className="queue-handle" />
          <h3 className="queue-title">Next up</h3>
          
          {[1, 2, 3].map(offset => {
            const nextIdx = (trackIndex + offset) % MOCK_TRACKS.length;
            const nextTrack = MOCK_TRACKS[nextIdx];
            return (
              <div key={nextIdx} className="queue-track">
                <div 
                  className="queue-track-art"
                  style={{ background: `linear-gradient(135deg, ${nextTrack.albumGradient[0]}, ${nextTrack.albumGradient[1]})` }}
                />
                <div className="queue-track-info">
                  <div className="queue-track-name">{nextTrack.trackName}</div>
                  <div className="queue-track-why">{nextTrack.artist}</div>
                </div>
              </div>
            );
          })}
          
          <button className="change-direction-btn" onClick={() => setShowSliderModal(true)}>
            Change direction
          </button>
        </div>
      )}

      {showSliderModal && (
        <div className="slider-modal-overlay">
          <div className="slider-modal">
            <h3 className="slider-modal-title">Adjust Adventurousness</h3>
            <div className="slider-track" style={{ margin: '32px 0' }}>
              <div className="slider-labels">
                <button 
                  className={`slider-label ${tempAdventureness === 'safe' ? 'active' : ''}`}
                  onClick={() => setTempAdventureness('safe')}
                >
                  Safe
                </button>
                <button 
                  className={`slider-label ${tempAdventureness === 'balanced' ? 'active' : ''}`}
                  onClick={() => setTempAdventureness('balanced')}
                >
                  Balanced
                </button>
                <button 
                  className={`slider-label ${tempAdventureness === 'wild' ? 'active' : ''}`}
                  onClick={() => setTempAdventureness('wild')}
                >
                  Wild
                </button>
              </div>
              
              <div className="slider-visual">
                <div 
                  className="slider-fill" 
                  style={{ 
                    width: tempAdventureness === 'safe' ? '16%' : tempAdventureness === 'balanced' ? '50%' : '84%' 
                  }} 
                />
                <div 
                  className="slider-thumb"
                  style={{ 
                    left: tempAdventureness === 'safe' ? '16%' : tempAdventureness === 'balanced' ? '50%' : '84%' 
                  }}
                />
              </div>
            </div>
            <button className="slider-modal-close" onClick={handleApplyDirection}>
              Apply
            </button>
          </div>
        </div>
      )}

      {showLoveModal && (
        <div className="love-modal-overlay">
          <div className="love-modal-sheet">
            <div className="love-modal-header">
              <h3 className="love-modal-title">Track Saved</h3>
              <p className="love-modal-subtitle">What would you like to do next?</p>
            </div>
            
            <div className="love-action-list">
              <button 
                className={`love-action-btn ${savedToLiked ? 'saved' : ''}`}
                onClick={() => setSavedToLiked(!savedToLiked)}
              >
                <span className="love-action-icon">💚</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Liked Songs</span>
                {savedToLiked && <span>✓</span>}
              </button>
              <button className="love-action-btn" onClick={() => alert('Opening playlist selector...')}>
                <span className="love-action-icon">🎵</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Add to Playlist...</span>
              </button>
            </div>

            <div className="session-toggle" style={{ margin: '0 0 24px 0' }}>
              <div className="session-toggle-text">
                Let this track influence my daily mixes and recommendations
              </div>
              <button 
                className={`toggle-switch ${impactRecommendations ? 'on' : ''}`}
                onClick={() => setImpactRecommendations(!impactRecommendations)}
              >
                <div className="toggle-switch-knob" />
              </button>
            </div>

            <button className="love-action-done" onClick={handleLoveModalDone}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
