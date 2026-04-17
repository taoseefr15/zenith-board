import { useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Search, Plus, LayoutGrid, Command, Sparkles } from "lucide-react";
import { useKanban } from "@/hooks/useKanban";
import { COLUMNS, type TaskEntry, type WorkflowStatus } from "@/lib/kanban-types";
import { WorkflowColumn } from "@/components/kanban/WorkflowColumn";
import { TaskFormPanel } from "@/components/kanban/TaskFormPanel";
import { Button } from "@/components/ui/button";

export function Board() {
  const { byColumn, counts, query, setQuery, createTask, updateTask, removeTask, moveTask } = useKanban();
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<TaskEntry | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<WorkflowStatus>("pending");

  const openNew = (status: WorkflowStatus = "pending") => {
    setEditing(null);
    setDefaultStatus(status);
    setPanelOpen(true);
  };

  const openEdit = (t: TaskEntry) => {
    setEditing(t);
    setDefaultStatus(t.status);
    setPanelOpen(true);
  };

  const handleSubmit = (data: Omit<TaskEntry, "id" | "createdAt" | "updatedAt">) => {
    if (editing) updateTask(editing.id, data);
    else createTask(data);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    moveTask(draggableId, destination.droppableId as WorkflowStatus, destination.index);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-glow shadow-glow">
              <LayoutGrid className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13.5px] font-semibold tracking-tight">Cascade</span>
              <span className="text-muted-foreground/60">/</span>
              <span className="text-[13px] text-muted-foreground">Product</span>
              <span className="text-muted-foreground/60">/</span>
              <span className="text-[13px] font-medium text-foreground">Engineering Sprint</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tasks…"
                className="h-8 w-64 rounded-md border border-border bg-secondary/40 pl-8 pr-12 text-[13px] text-foreground placeholder:text-muted-foreground focus-ring transition-colors hover:bg-secondary/60 focus:bg-background"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </div>

            <Button
              size="sm"
              onClick={() => openNew("pending")}
              className="h-8 gap-1.5 bg-foreground text-background hover:bg-foreground/90"
            >
              <Plus className="h-3.5 w-3.5" />
              New task
            </Button>
          </div>
        </div>

        {/* Sub bar */}
        <div className="flex items-center gap-4 border-t border-border/60 px-4 py-2.5 md:px-6">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <h1 className="text-[13.5px] font-semibold tracking-tight">Q4 Workflow Board</h1>
          </div>
          <span className="text-muted-foreground/40">·</span>
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            <span><span className="tabular-nums text-foreground">{counts.total}</span> tasks</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-col-progress" />
              <span className="tabular-nums">{counts.in_progress}</span> active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-col-completed" />
              <span className="tabular-nums">{counts.completed}</span> done
            </span>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="scrollbar-thin h-[calc(100vh-7.5rem)] overflow-x-auto px-4 py-4 md:px-6">
            <div className="flex h-full min-w-min gap-4">
              {COLUMNS.map(col => (
                <WorkflowColumn
                  key={col.id}
                  column={col}
                  tasks={byColumn[col.id]}
                  onAdd={() => openNew(col.id)}
                  onEdit={openEdit}
                  onRemove={removeTask}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      </main>

      <TaskFormPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        initial={editing}
        defaultStatus={defaultStatus}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
