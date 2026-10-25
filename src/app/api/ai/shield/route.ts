import { NextRequest, NextResponse } from 'next/server';
import { StudentAIService } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Missing opportunity text' }, { status: 400 });
    }
    const result = await StudentAIService.scanOpportunity(text);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Scanning failed' }, { status: 500 });
  }
}
