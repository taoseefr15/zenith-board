import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRIORITY_META, type TaskEntry, type WorkflowStatus } from "@/lib/kanban-types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: TaskEntry | null;
  defaultStatus: WorkflowStatus;
  onSubmit: (data: Omit<TaskEntry, "id" | "createdAt" | "updatedAt">) => void;
}

const PRIORITIES: TaskEntry["priority"][] = ["low", "medium", "high", "urgent"];
const STATUS_OPTIONS: { id: WorkflowStatus; label: string }[] = [
  { id: "pending", label: "Backlog" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export function TaskFormPanel({ open, onOpenChange, initial, defaultStatus, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<WorkflowStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskEntry["priority"]>("medium");
  const [labelsText, setLabelsText] = useState("");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDescription(initial?.description ?? "");
      setStatus(initial?.status ?? defaultStatus);
      setPriority(initial?.priority ?? "medium");
      setLabelsText(initial?.labels.join(", ") ?? "");
      setAssignee(initial?.assignee ?? "");
    }
  }, [open, initial, defaultStatus]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      labels: labelsText.split(",").map(s => s.trim()).filter(Boolean),
      assignee: assignee.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-l border-border bg-surface p-0 sm:max-w-md"
      >
        <form onSubmit={submit} className="flex h-full flex-col">
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-base font-semibold tracking-tight">
                  {initial ? "Edit task" : "New task"}
                </SheetTitle>
                <SheetDescription className="mt-0.5 text-xs text-muted-foreground">
                  {initial ? "Update task details and workflow." : "Capture a new unit of work."}
                </SheetDescription>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground focus-ring"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </SheetHeader>

          <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-5">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-[12px] font-medium">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                required
                className="bg-background/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc" className="text-[12px] font-medium">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add details, acceptance criteria, links…"
                rows={4}
                className="resize-none bg-background/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Status</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatus(s.id)}
                    className={cn(
                      "rounded-md border px-2 py-1.5 text-[12px] font-medium transition-all",
                      status === s.id
                        ? "border-primary/50 bg-primary/10 text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                        : "border-border bg-background/40 text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Priority</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {PRIORITIES.map(p => {
                  const meta = PRIORITY_META[p];
                  const active = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[12px] font-medium transition-all",
                        active
                          ? "border-border-strong bg-surface-elevated text-foreground"
                          : "border-border bg-background/40 text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="assignee" className="text-[12px] font-medium">Assignee</Label>
                <Input
                  id="assignee"
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  placeholder="e.g. Maya K"
                  className="bg-background/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="labels" className="text-[12px] font-medium">Labels</Label>
                <Input
                  id="labels"
                  value={labelsText}
                  onChange={e => setLabelsText(e.target.value)}
                  placeholder="design, api"
                  className="bg-background/60"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border bg-surface/60 px-5 py-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {initial ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
