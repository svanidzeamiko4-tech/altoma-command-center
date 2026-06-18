export interface FounderBrainRequest {
  prompt: string;
}

export async function queryFounderBrain(
  req: FounderBrainRequest
): Promise<string> {
  // Phase 4: inject summaries from all project brains + vault + journal
  // Phase 1: stub
  return "Founder Brain not yet active.";
}
