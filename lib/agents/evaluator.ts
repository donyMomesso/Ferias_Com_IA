import type { ResearchFinding, ScoredOption } from "./types";

const categoryWeights: Record<ResearchFinding["category"], number> = {
  hospedagem: 92,
  passeio: 96,
  restaurante: 78,
  transporte: 82,
  clima: 88,
  seguranca: 94,
  fornecedor: 90
};

export function scoreFindings(findings: ResearchFinding[]): ScoredOption[] {
  return findings
    .map((finding) => {
      const baseScore = categoryWeights[finding.category];
      const confidenceBonus = Math.round(finding.confidence * 10);
      const score = Math.min(100, baseScore + confidenceBonus - 5);

      return {
        ...finding,
        score,
        reason: `Boa aderência ao objetivo da viagem e confiança ${Math.round(
          finding.confidence * 100
        )}%.`,
        tradeoff:
          finding.category === "passeio"
            ? "Pode depender de clima e disponibilidade."
            : "Precisa ser confirmado com dados reais antes da compra."
      };
    })
    .sort((a, b) => b.score - a.score);
}
