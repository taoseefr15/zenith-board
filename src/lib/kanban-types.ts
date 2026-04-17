export type WorkflowStatus = "pending" | "in_progress" | "completed";

export interface TaskEntry {
  id: string;
  title: string;
  description?: string;
  status: WorkflowStatus;
  priority: "low" | "medium" | "high" | "urgent";
  labels: string[];
  assignee?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ColumnDef {
  id: WorkflowStatus;
  title: string;
  hint: string;
  accent: string;
}

export const COLUMNS: ColumnDef[] = [
  { id: "pending", title: "Backlog", hint: "Not started", accent: "bg-col-pending" },
  { id: "in_progress", title: "In Progress", hint: "Currently active", accent: "bg-col-progress" },
  { id: "completed", title: "Completed", hint: "Shipped & done", accent: "bg-col-completed" },
];

export const PRIORITY_META: Record<TaskEntry["priority"], { label: string; dot: string; ring: string }> = {
  low: { label: "Low", dot: "bg-muted-foreground/60", ring: "ring-muted-foreground/20" },
  medium: { label: "Medium", dot: "bg-info", ring: "ring-info/20" },
  high: { label: "High", dot: "bg-warning", ring: "ring-warning/20" },
  urgent: { label: "Urgent", dot: "bg-destructive", ring: "ring-destructive/20" },
};
