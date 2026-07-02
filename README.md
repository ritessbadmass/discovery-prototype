# Discovery Mode — Spotify Concept Prototype

> A fellowship project prototype exploring how Spotify could let users intentionally enter exploration sessions, receive AI-explained recommendations, and decide what Spotify remembers afterward.

⚠️ **This is a concept prototype. It is not affiliated with or endorsed by Spotify.**

## Features

- **6 Interactive Screens**: Home feed, Activation flow, Discovery Player, Memory Review, Taste Profile, and Onboarding
- **Real AI Integration**: Gemini-powered track explanations ("why surfaced") and session summaries
- **Privacy-First Design**: Users control exactly what gets remembered from exploration sessions
- **Spotify Visual Language**: Dark theme, green accents, circular art, rounded cards

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **AI**: Google Gemini 2.0 Flash via `@google/genai`
- **Styling**: Custom CSS (Spotify dark theme)
- **State**: localStorage
- **Deploy**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with your Gemini API key:
   ```
   GEMINI_API_KEY=your_key_here
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## Deployment

Deploy to Vercel:
```bash
npx vercel
```

Set `GEMINI_API_KEY` in your Vercel project's Environment Variables.

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/` | Mocked Spotify feed with Discovery banner |
| Activate | `/activate` | 3-step intent + adventurousness flow |
| Player | `/player` | Discovery session with AI track explanations |
| Review | `/review` | End-of-session memory control |
| Profile | `/profile` | Taste transparency & session history |

## AI Endpoints

- `POST /api/why-surfaced` — Per-track explanation label (max 8 words)
- `POST /api/session-summary` — Session recap (max 20 words)

---

*Built as a fellowship project prototype. Concept Prototype — not affiliated with Spotify.*
