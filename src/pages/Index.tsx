import { useEffect } from "react";
import { Board } from "@/components/kanban/Board";

const Index = () => {
  useEffect(() => {
    document.title = "Cascade — Premium Kanban Board";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Cascade is a high-end, developer-grade Kanban board with drag-and-drop, priorities, and a Linear-inspired UI.";
    if (meta) meta.setAttribute("content", content);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = content;
      document.head.appendChild(m);
    }
  }, []);

  return <Board />;
};

export default Index;
