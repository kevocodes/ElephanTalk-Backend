export interface ToxicityClassificationResult {
  toxicity: number;
  severe_toxicity: number;
  obscene: number;
  identity_attack: number;
  insult: number;
  threat: number;
  sexual_explicit: number;
}