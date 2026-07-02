import { generateSessionSummary } from '@/lib/discoveryGemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { intentTag, tracks } = body;

    if (!intentTag || !tracks || !Array.isArray(tracks)) {
      return Response.json(
        { error: 'Missing required fields: intentTag, tracks[]' },
        { status: 400 }
      );
    }

    const summary = await generateSessionSummary(intentTag, tracks);

    return Response.json({ summary });
  } catch (error) {
    console.error('session-summary API error:', error);
    return Response.json(
      { summary: 'You had an adventurous Discovery session.' },
      { status: 200 }
    );
  }
}
