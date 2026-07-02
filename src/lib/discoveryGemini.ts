import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is not configured');
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

export async function generateWhySurfaced(
  intentTag: string,
  userGenres: string[],
  trackName: string,
  artist: string,
  genre: string
): Promise<string> {
  const aiInstance = getAI();

  const prompt = `Given that this user's intent is "${intentTag}" and their usual genres are [${userGenres.join(', ')}], explain in one short phrase (max 8 words) why "${trackName}" by ${artist} (${genre}) was surfaced in their Discovery session. Be specific. Examples: "Adjacent to your indie taste", "Completely new — German metal", "Same energy, different era". Return ONLY the phrase, no quotes, no explanation.`;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 30,
      },
    });

    const text = (response.text || '').trim().replace(/^["']|["']$/g, '');
    return text || 'Curated for your Discovery session';
  } catch (err) {
    console.error('Gemini why-surfaced error:', err);
    return 'Curated for your Discovery session';
  }
}

export async function generateSessionSummary(
  intentTag: string,
  tracks: { trackName: string; genre: string; userSignal: string | null }[]
): Promise<string> {
  const aiInstance = getAI();

  const trackList = tracks
    .map((t) => `${t.trackName} (${t.genre}) — signal: ${t.userSignal || 'none'}`)
    .join('; ');

  const prompt = `A Spotify user just finished a Discovery Mode session. Intent: "${intentTag}". Tracks: [${trackList}]. Generate a 1-sentence warm summary of what they explored, max 20 words. Example: "You explored indie hip-hop and alt-pop tonight — 12 tracks, 3 new artists worth remembering." Return ONLY the summary sentence.`;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 50,
      },
    });

    const text = (response.text || '').trim();
    return text || `You explored ${tracks.length} tracks in Discovery Mode tonight.`;
  } catch (err) {
    console.error('Gemini session-summary error:', err);
    return `You explored ${tracks.length} tracks in Discovery Mode tonight.`;
  }
}
