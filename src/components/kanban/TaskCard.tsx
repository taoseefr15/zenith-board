import { Draggable } from "@hello-pangea/dnd";
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIORITY_META, type TaskEntry } from "@/lib/kanban-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  task: TaskEntry;
  index: number;
  onEdit: (t: TaskEntry) => void;
  onRemove: (id: string) => void;
}

const formatDate = (ts: number) => {
  const d = new Date(ts);
  const now = new Date();
  const diff = (now.getTime() - ts) / 86_400_000;
  if (diff < 1) return "Today";
  if (diff < 2) return "Yesterday";
  if (diff < 7) return `${Math.floor(diff)}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const initials = (name?: string) =>
  (name ?? "?").split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();

export function TaskCard({ task, index, onEdit, onRemove }: Props) {
  const priority = PRIORITY_META[task.priority];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform ?? ""} rotate(1.5deg)`
              : provided.draggableProps.style?.transform,
          }}
          className={cn(
            "group relative rounded-lg border border-border bg-card p-3.5 text-card-foreground",
            "shadow-card transition-all duration-200 ease-smooth",
            "hover:border-border-strong hover:bg-surface-hover hover:-translate-y-0.5",
            "animate-fade-in-up",
            snapshot.isDragging && "shadow-drag border-primary/40 bg-surface-elevated rotate-[1.5deg] scale-[1.02]"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn("h-2 w-2 rounded-full ring-4", priority.dot, priority.ring)} />
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {priority.label}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity rounded p-1 hover:bg-accent text-muted-foreground hover:text-foreground focus-ring"
                  aria-label="Task actions"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onRemove(task.id)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h4 className="mt-2 text-sm font-medium leading-snug text-foreground line-clamp-2">
            {task.title}
          </h4>

          {task.description && (
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {task.labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {task.labels.map(l => (
                <span
                  key={l}
                  className="inline-flex items-center rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground"
                >
                  {l}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(task.updatedAt)}
            </div>
            {task.assignee && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary-glow text-[10px] font-semibold text-primary-foreground ring-2 ring-card"
                title={task.assignee}
              >
                {initials(task.assignee)}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
