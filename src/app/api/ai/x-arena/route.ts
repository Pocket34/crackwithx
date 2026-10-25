import { NextRequest, NextResponse } from 'next/server';
import { XArenaService } from '@/services/xArenaService';

export async function POST(req: NextRequest) {
  try {
    const { prompt, selectedModels, mode, attachedFileName } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const result = await XArenaService.queryMultiAI(
      prompt,
      selectedModels || ['gpt', 'gemini', 'claude', 'perplexity'],
      mode || 'EXAM',
      attachedFileName
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'X-Arena query failed' }, { status: 500 });
  }
}
