'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/discovery/BottomNav';
import { 
  IntentTag, 
  AdventurenessLevel, 
  SessionObject 
} from '@/lib/discoveryTypes';
import { INTENT_OPTIONS } from '@/lib/mockTracks';
import { saveSession, createSessionId } from '@/lib/discoveryStore';

export default function ActivatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<IntentTag | null>(null);
  const [adventureness, setAdventureness] = useState<AdventurenessLevel>('balanced');
  
  const handleIntentSelect = (tag: IntentTag) => {
    setIntent(tag);
    setTimeout(() => setStep(2), 300);
  };

  const handleStartSession = (level: AdventurenessLevel) => {
    setAdventureness(level);
    setStep(3);

    const session: SessionObject = {
      sessionId: createSessionId(),
      intentTag: intent || 'somewhere-new',
      adventurenessLevel: level,
      tracks: [],
      aiSummary: null,
      status: 'active',
      startedAt: new Date().toISOString(),
      endedAt: null,
    };
    
    saveSession(session);

    setTimeout(() => {
      router.push('/player');
    }, 2000);
  };

  return (
    <>
      <div className="activate-page animate-fade-in">
        <div className="activate-step-indicator">
          <div className={`step-dot ${step >= 1 ? 'completed' : ''}`} />
          <div className={`step-dot ${step >= 2 ? 'completed' : ''}`} />
          <div className={`step-dot ${step === 3 ? 'completed' : ''}`} />
        </div>

        {step === 1 && (
          <div className="animate-slide-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h1 className="activate-title">What kind of discovery?</h1>
            <p className="activate-subtitle">Pick your vibe for this session</p>
            
            <div className="intent-cards">
              {INTENT_OPTIONS.map((option) => (
                <div 
                  key={option.tag}
                  className={`intent-card ${intent === option.tag ? 'selected' : ''}`}
                  onClick={() => handleIntentSelect(option.tag)}
                >
                  <div className="intent-card-emoji">{option.emoji}</div>
                  <div className="intent-card-text">
                    <h4>{option.title}</h4>
                    <p>{option.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-in slider-container">
            <h1 className="activate-title">How adventurous?</h1>
            <p className="activate-subtitle">Set your boundaries</p>
            
            <div className="slider-track">
              <div className="slider-labels">
                <button 
                  className={`slider-label ${adventureness === 'safe' ? 'active' : ''}`}
                  onClick={() => setAdventureness('safe')}
                >
                  Safe
                </button>
                <button 
                  className={`slider-label ${adventureness === 'balanced' ? 'active' : ''}`}
                  onClick={() => setAdventureness('balanced')}
                >
                  Balanced
                </button>
                <button 
                  className={`slider-label ${adventureness === 'wild' ? 'active' : ''}`}
                  onClick={() => setAdventureness('wild')}
                >
                  Wild
                </button>
              </div>
              
              <div className="slider-visual">
                <div 
                  className="slider-fill" 
                  style={{ 
                    width: adventureness === 'safe' ? '16%' : adventureness === 'balanced' ? '50%' : '84%' 
                  }} 
                />
                <div 
                  className="slider-thumb"
                  style={{ 
                    left: adventureness === 'safe' ? '16%' : adventureness === 'balanced' ? '50%' : '84%' 
                  }}
                />
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '32px' }}
              onClick={() => handleStartSession(adventureness)}
            >
              Start Session
            </button>
            
            <button 
              className="surprise-btn"
              onClick={() => handleStartSession('wild')}
            >
              Just surprise me
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in confirm-container">
            <div className="confirm-pulse">🧭</div>
            <h1 className="confirm-title">Discovery Mode is on</h1>
            <p className="confirm-tagline">We'll track what you love. You decide what stays.</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </>
  );
}
