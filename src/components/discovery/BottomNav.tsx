'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <Link
          href="/"
          className={`bottom-nav-item ${pathname === '/' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link
          href="/"
          className="bottom-nav-item"
        >
          <span className="bottom-nav-icon">🔍</span>
          <span>Search</span>
        </Link>
        <Link
          href="/profile"
          className={`bottom-nav-item ${pathname === '/profile' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">📚</span>
          <span>Library</span>
        </Link>
        <Link
          href="/activate"
          className={`bottom-nav-item discovery-nav ${pathname?.startsWith('/activate') || pathname?.startsWith('/player') ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">🧭</span>
          <span>Discovery</span>
        </Link>
      </div>
      <div className="prototype-footer">
        Concept Prototype · Not affiliated with Spotify
      </div>
    </nav>
  );
}
