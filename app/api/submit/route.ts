import { NextRequest, NextResponse } from 'next/server';
import { harassmentQuestions, harassmentTypes } from '@/data/harassment-type';

const VALID_TYPE_IDS = new Set(harassmentTypes.map((t) => t.id));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { timestamp, typeId, scores, answers } = body;

    if (
      !VALID_TYPE_IDS.has(typeId) ||
      typeof answers !== 'string' ||
      answers.length !== harassmentQuestions.length ||
      !new RegExp(`^[A-D]{${harassmentQuestions.length}}$`).test(answers) ||
      !scores ||
      (['P', 'M', 'S', 'C'] as const).some(
        (k) => typeof scores[k] !== 'number' || scores[k] < 0 || scores[k] > 100,
      )
    ) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) return NextResponse.json({ ok: true });

    await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp, typeId, scores, answers }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // GAS障害・タイムアウトはユーザーに見せない
  }

  return NextResponse.json({ ok: true });
}
