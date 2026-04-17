import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColumnDef, TaskEntry } from "@/lib/kanban-types";
import { TaskCard } from "./TaskCard";

interface Props {
  column: ColumnDef;
  tasks: TaskEntry[];
  onAdd: () => void;
  onEdit: (t: TaskEntry) => void;
  onRemove: (id: string) => void;
}

export function WorkflowColumn({ column, tasks, onAdd, onEdit, onRemove }: Props) {
  return (
    <div className="flex h-full min-w-[300px] flex-1 flex-col rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
      <header className="flex items-center justify-between border-b border-border/70 px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <span className={cn("h-2 w-2 rounded-full", column.accent)} />
          <h3 className="text-[13px] font-semibold tracking-tight text-foreground">{column.title}</h3>
          <span className="rounded-md bg-secondary/70 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-ring"
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "scrollbar-thin flex-1 space-y-2 overflow-y-auto p-2.5 transition-colors duration-200",
              snapshot.isDraggingOver && "bg-primary/[0.04]"
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onEdit={onEdit} onRemove={onRemove} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <button
                onClick={onAdd}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/70 px-3 py-6 text-[12px] text-muted-foreground transition-all hover:border-border-strong hover:bg-secondary/30 hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                New task
              </button>
            )}
          </div>
        )}
      </Droppable>

      <div className="border-t border-border/70 p-2">
        <button
          onClick={onAdd}
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-ring"
        >
          <Plus className="h-3.5 w-3.5" />
          Add task
        </button>
      </div>
    </div>
  );
}
