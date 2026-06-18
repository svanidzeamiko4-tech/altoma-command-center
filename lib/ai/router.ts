export type BrainTarget =
  | "founder"
  | "athletiq"
  | "whaleiq"
  | "at_analytics"
  | "altoma";

export interface RouterRequest {
  prompt: string;
  project_slug?: string;
  scope?: "project" | "founder" | "global";
}

export interface RouterResponse {
  brain: BrainTarget;
  response: string;
}

export async function route(req: RouterRequest): Promise<RouterResponse> {
  // Phase 4: real routing logic here
  // Phase 1: stub
  return {
    brain: req.project_slug ? (req.project_slug as BrainTarget) : "founder",
    response: "Altoma AI Router not yet active.",
  };
}
