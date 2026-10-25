import { NextRequest, NextResponse } from 'next/server';
import { StudentAIService } from '@/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const { question, studentAnswer, roundNumber } = await req.json();
    if (!question || !studentAnswer) {
      return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });
    }
    const evaluation = await StudentAIService.evaluateVivaResponse(question, studentAnswer, roundNumber || 1);
    return NextResponse.json(evaluation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Evaluation failed' }, { status: 500 });
  }
}
