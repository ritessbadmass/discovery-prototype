'use client';

import BottomNav from '@/components/discovery/BottomNav';

export default function SearchPage() {
  return (
    <>
      <div className="home-header" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</h1>
        <h2>Search</h2>
        <p style={{ color: 'var(--sp-text-subdued)', marginTop: '8px' }}>
          This is just a placeholder screen for the prototype. In a real app, the search experience would be here.
        </p>
      </div>
      <BottomNav />
    </>
  );
}
