import type { NotePriority, NoteType } from "@/lib/types";

export const NOTE_TYPES: { value: NoteType; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "task", label: "Task" },
  { value: "lesson", label: "Lesson" },
  { value: "decision", label: "Decision" },
  { value: "random", label: "Random" },
];

export const NOTE_PRIORITIES: { value: NotePriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "#10B981" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "high", label: "High", color: "#EF4444" },
];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function detectSource(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

export function priorityColor(priority: NotePriority): string {
  const map: Record<NotePriority, string> = {
    low: "#10B981",
    medium: "#F59E0B",
    high: "#EF4444",
  };
  return map[priority];
}

export function healthColor(health: string): string {
  const map: Record<string, string> = {
    green: "#10B981",
    yellow: "#F59E0B",
    red: "#EF4444",
    unknown: "#6B6A65",
  };
  return map[health] ?? map.unknown;
}
