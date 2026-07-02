import { generateWhySurfaced } from '@/lib/discoveryGemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { intentTag, userGenres, trackName, artist, genre } = body;

    if (!intentTag || !trackName || !artist || !genre) {
      return Response.json(
        { error: 'Missing required fields: intentTag, trackName, artist, genre' },
        { status: 400 }
      );
    }

    const label = await generateWhySurfaced(
      intentTag,
      userGenres || ['indie', 'hip-hop'],
      trackName,
      artist,
      genre
    );

    return Response.json({ label });
  } catch (error) {
    console.error('why-surfaced API error:', error);
    return Response.json(
      { label: 'Curated for your Discovery session' },
      { status: 200 }
    );
  }
}
