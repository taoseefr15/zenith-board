import { useCallback, useEffect, useMemo, useState } from "react";
import type { TaskEntry, WorkflowStatus } from "@/lib/kanban-types";

const STORAGE_KEY = "kanban.board.v1";

const seedTasks = (): TaskEntry[] => {
  const now = Date.now();
  return [
    { id: crypto.randomUUID(), title: "Design system tokens audit", description: "Review color, spacing, and shadow scales for v2.1", status: "pending", priority: "medium", labels: ["design", "infra"], assignee: "MK", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: "Implement OAuth refresh rotation", description: "Replace static tokens with rotating refresh strategy.", status: "pending", priority: "high", labels: ["auth", "backend"], assignee: "RS", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: "Drag handle micro-interactions", description: "Polish cursor + tilt animation while dragging.", status: "in_progress", priority: "low", labels: ["ux"], assignee: "AL", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: "Migrate analytics to typed events", status: "in_progress", priority: "urgent", labels: ["data"], assignee: "TN", createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: "Q3 changelog announcement", description: "Draft + schedule the release notes post.", status: "completed", priority: "medium", labels: ["marketing"], assignee: "JP", createdAt: now, updatedAt: now },
  ];
};

const load = (): TaskEntry[] => {
  if (typeof window === "undefined") return seedTasks();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedTasks();
    const parsed = JSON.parse(raw) as TaskEntry[];
    return Array.isArray(parsed) ? parsed : seedTasks();
  } catch {
    return seedTasks();
  }
};

const STATUSES: WorkflowStatus[] = ["pending", "in_progress", "completed"];

const regroup = (list: TaskEntry[]) =>
  STATUSES.flatMap(s => list.filter(t => t.status === s));

export function useKanban() {
  const [tasks, setTasks] = useState<TaskEntry[]>(() => regroup(load()));
  const [query, setQuery] = useState("");

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const createTask = useCallback((data: Omit<TaskEntry, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    setTasks(prev => regroup([{ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now }, ...prev]));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<TaskEntry>) => {
    setTasks(prev => regroup(prev.map(t => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t))));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, destStatus: WorkflowStatus, destIndex: number) => {
    setTasks(prev => {
      const target = prev.find(t => t.id === id);
      if (!target) return prev;
      const updated: TaskEntry = { ...target, status: destStatus, updatedAt: Date.now() };
      // Build per-column lists
      const cols: Record<WorkflowStatus, TaskEntry[]> = { pending: [], in_progress: [], completed: [] };
      prev.forEach(t => { if (t.id !== id) cols[t.status].push(t); });
      cols[destStatus].splice(destIndex, 0, updated);
      return [...cols.pending, ...cols.in_progress, ...cols.completed];
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.labels.some(l => l.toLowerCase().includes(q))
    );
  }, [tasks, query]);

  const byColumn = useMemo(() => {
    const map: Record<WorkflowStatus, TaskEntry[]> = { pending: [], in_progress: [], completed: [] };
    filtered.forEach(t => map[t.status].push(t));
    return map;
  }, [filtered]);

  const counts = useMemo(() => ({
    pending: tasks.filter(t => t.status === "pending").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    total: tasks.length,
  }), [tasks]);

  return { tasks, byColumn, counts, query, setQuery, createTask, updateTask, removeTask, moveTask };
}
