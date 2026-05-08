import type { PercentScores } from './scoring';

export function buildShareText(
  typeName: string,
  attributesLabel: string,
  scores: PercentScores,
  resultUrl: string,
): string {
  const label = `${attributesLabel} ${typeName}`;
  return [
    `私のハラスメントタイプは「${label}」でした`,
    ``,
    `P:${scores.P}% / M:${scores.M}% / S:${scores.S}% / C:${scores.C}%`,
    ``,
    `#ハラスメントタイプ診断`,
    resultUrl,
  ].join('\n');
}
