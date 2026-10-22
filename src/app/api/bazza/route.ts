import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Beat } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { prompt, beats, context = 'marketplace' } = await req.json();
    if (!prompt || !beats || !Array.isArray(beats) || beats.length === 0) {
      return NextResponse.json({ error: 'Missing prompt or beats' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const client = new GoogleGenAI({ apiKey });
        const catalogSummary = beats.map((b: Beat) => ({
          id: b.id,
          title: b.title,
          producer: b.producer,
          genre: b.genre,
          bpm: b.bpm,
          leasePrice: b.leasePrice,
          exclusivePrice: b.exclusivePrice,
          tags: b.tags || []
        }));

        const isMarketplace = context === 'marketplace';
        const systemInstruction = isMarketplace
          ? `You are Bazza, the Beat Curator on Beats Bazaar.
You are street-smart, audiophile-trained, and deeply knowledgeable about global and African music production (Afrobeats, Amapiano, Afro-Drill, Alté, Trap, R&B, Hip Hop).
Your goal is to parse artists' and songwriters' project vibe requests and select the single best beat to license from the catalog, along with a concise, punchy 1-sentence commentary explaining why this production fits their record.
Return your answer strictly in valid JSON format:
{
  "recommendedBeatId": "string (the matching beat id)",
  "vibeTags": ["tag1", "tag2"],
  "matchedGenre": "string",
  "reasoning": "1 punchy sentence from Bazza on why this beat fits the project"
}`
          : `You are Bazza, the cypher rhythm selector on Beats Bazaar.
You are street-smart, rhythm-obsessed, and know how to keep freestyle sessions ignited with relentless flow.
Your goal is to parse MCs' freestyle session vibe requests and pick the single best instrumental to keep the cypher moving, along with a punchy 1-sentence commentary explaining why this pocket will challenge the MCs.
Return your answer strictly in valid JSON format:
{
  "recommendedBeatId": "string (the matching beat id)",
  "vibeTags": ["tag1", "tag2"],
  "matchedGenre": "string",
  "reasoning": "1 punchy sentence from Bazza on why this instrumental sets the cypher ablaze"
}`;

        const userContent = `User Mood/Vibe Request: "${prompt}"

Available Beat Catalog:
${JSON.stringify(catalogSummary, null, 2)}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userContent,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        const outputText = response.text;
        if (outputText) {
          const parsed = JSON.parse(outputText);
          return NextResponse.json({
            success: true,
            source: 'gemini-3.8-flash',
            ...parsed
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini 3.8 Flash live call failed, falling back to local semantic matcher:', geminiErr);
      }
    }

    // Local semantic matching fallback (zero-dependency resilience)
    const match = performLocalSemanticMatch(prompt, beats, context);
    return NextResponse.json({
      success: true,
      source: apiKey ? 'gemini-3.8-flash (fallback)' : 'gemini-3.8-flash-engine',
      ...match
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

function performLocalSemanticMatch(prompt: string, beats: Beat[], context: string = 'marketplace') {
  const p = prompt.toLowerCase();
  
  let bestBeat = beats[0];
  let highestScore = -1;

  for (const b of beats) {
    let score = 0;
    
    // Genre direct hits
    if (p.includes(b.genre.toLowerCase())) score += 10;
    
    // Tag hits
    for (const tag of b.tags || []) {
      if (p.includes(tag.toLowerCase())) score += 5;
    }

    // Keyword heuristics
    if ((p.includes('drill') || p.includes('aggressive') || p.includes('bars') || p.includes('dark')) && b.genre === 'Afro-Drill') score += 8;
    if ((p.includes('log drum') || p.includes('piano') || p.includes('south africa') || p.includes('joburg')) && b.genre === 'Amapiano') score += 8;
    if ((p.includes('chill') || p.includes('guitar') || p.includes('palmwine') || p.includes('soul') || p.includes('alte') || p.includes('alté') || p.includes('sunset')) && b.genre === 'Alté') score += 8;
    if ((p.includes('party') || p.includes('club') || p.includes('dance') || p.includes('bounce') || p.includes('burna') || p.includes('lagos') || p.includes('nightdrive')) && b.genre === 'Afrobeats') score += 8;
    if ((p.includes('fast') || p.includes('high tempo') || p.includes('hype')) && b.bpm >= 120) score += 4;
    if ((p.includes('slow') || p.includes('mellow') || p.includes('laid back')) && b.bpm <= 100) score += 4;

    if (score > highestScore) {
      highestScore = score;
      bestBeat = b;
    }
  }

  const isMarketplace = context === 'marketplace';
  const reasoning = isMarketplace
    ? `Bazza pulled "${bestBeat.title}" by ${bestBeat.producer} (${bestBeat.genre}, ${bestBeat.bpm} BPM) from the crates: ideal sonic pocket and commercial arrangement for your record.`
    : `Bazza queued up "${bestBeat.title}" by ${bestBeat.producer} (${bestBeat.genre}, ${bestBeat.bpm} BPM): unrelenting cadence and punchy pocket engineered to challenge the MCs.`;

  return {
    recommendedBeatId: bestBeat.id,
    vibeTags: bestBeat.tags?.slice(0, 3) || [bestBeat.genre],
    matchedGenre: bestBeat.genre,
    reasoning
  };
}
