'use client';

import { useState } from 'react';
import { markVisited } from '@/lib/discoveryStore';

interface OnboardingOverlayProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    icon: '🔄',
    title: 'Spotify learns from everything you play. Discovery Mode changes that.',
    text: 'Every song you play shapes your recommendations. But what if you want to explore without consequences?',
  },
  {
    icon: '🎵',
    title: 'Explore freely — new genres, random rabbit holes.',
    text: 'We won\'t update your main recommendations. Listen to German metal, Malayalam pop, or anything else without worrying about your feed.',
  },
  {
    icon: '✨',
    title: 'At the end, you choose what Spotify remembers.',
    text: 'Keep the gems, drop the rest. You\'re in complete control of what sticks.',
  },
];

export default function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      markVisited();
      onComplete();
    }
  };

  const handleSkip = () => {
    markVisited();
    onComplete();
  };

  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <div className="onboarding-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleSkip(); }}>
      <div className="onboarding-container">
        <div className="onboarding-slide" key={currentSlide}>
          <div className="onboarding-icon">{slide.icon}</div>
          <h2 className="onboarding-title">{slide.title}</h2>
          <p className="onboarding-text">{slide.text}</p>
        </div>

        <div className="onboarding-dots">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`onboarding-dot ${i === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="onboarding-nav">
          {!isLastSlide && (
            <button className="onboarding-skip" onClick={handleSkip}>
              Skip
            </button>
          )}
          <button className="onboarding-next" onClick={handleNext}>
            {isLastSlide ? 'Start exploring' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
