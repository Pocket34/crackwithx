import { NextRequest, NextResponse } from 'next/server';
import { StudentAIService } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const { text, fileName } = await req.json();
    if (!text && !fileName) {
      return NextResponse.json({ error: 'Missing notice text or file' }, { status: 400 });
    }
    const result = await StudentAIService.extractActionFromNotice(text || '', fileName);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Extraction failed' }, { status: 500 });
  }
}
