'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/discovery/BottomNav';
import OnboardingOverlay from '@/components/discovery/OnboardingOverlay';
import { isFirstVisit } from '@/lib/discoveryStore';
import { MOCK_RECENT_PLAYLISTS, MOCK_DAILY_MIXES, MOCK_ON_REPEAT } from '@/lib/mockTracks';

export default function HomePage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const [greeting, setGreeting] = useState('Good evening');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    if (isFirstVisit()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 5000);
  };

  return (
    <>
      <div className="home-header">
        <h1 className="home-greeting">{greeting}</h1>
      </div>

      <div 
        className="discovery-banner"
        onClick={() => router.push('/activate')}
      >
        <div className="discovery-banner-icon">🧭</div>
        <h3>Feeling exploratory today?</h3>
        <p>Discovery Mode: Explore freely, decide later what Spotify remembers.</p>
      </div>

      <h2 className="section-header">Recent playlists</h2>
      <div className="recent-grid">
        {MOCK_RECENT_PLAYLISTS.map((playlist) => (
          <div key={playlist.id} className="recent-card">
            <div 
              className="recent-card-art" 
              style={{ background: `linear-gradient(135deg, ${playlist.gradient[0]}, ${playlist.gradient[1]})` }}
            />
            <div className="recent-card-name">{playlist.name}</div>
          </div>
        ))}
      </div>

      <h2 className="section-header">Made For You</h2>
      <div className="scroll-row">
        {MOCK_DAILY_MIXES.map((mix) => (
          <div key={mix.id} className="scroll-card">
            <div 
              className="scroll-card-art"
              style={{ background: `linear-gradient(135deg, ${mix.gradient[0]}, ${mix.gradient[1]})` }}
            />
            <div className="scroll-card-name">{mix.name}</div>
            <div className="scroll-card-sub">{mix.artists}</div>
          </div>
        ))}
      </div>

      <h2 className="section-header">On Repeat</h2>
      <div className="scroll-row" style={{ paddingBottom: '32px' }}>
        {MOCK_ON_REPEAT.map((track) => (
          <div key={track.id} className="scroll-card">
            <div 
              className="scroll-card-art"
              style={{ background: `linear-gradient(135deg, ${track.gradient[0]}, ${track.gradient[1]})`, borderRadius: '50%' }}
            />
            <div className="scroll-card-name">{track.name}</div>
            <div className="scroll-card-sub">{track.artist}</div>
          </div>
        ))}
      </div>

      {showTooltip && (
        <div className="tooltip-wrapper">
          <div className="tooltip">
            Explore freely. Decide later what Spotify remembers.
            <button className="tooltip-dismiss" onClick={() => setShowTooltip(false)}>Got it</button>
          </div>
        </div>
      )}

      {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} />}
      
      <BottomNav />
    </>
  );
}
