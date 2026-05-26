"use client";

import { useState } from "react";

import { format } from "date-fns";
import {
  CircleCheck,
  ClipboardList,
  Eye,
  ListTodo,
  LoaderCircle,
  type LucideIcon,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import {
  type DragEndEvent,
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Task = {
  id: string;
  name: string;
  column: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  assignee?: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
  dueDate?: string;
};

type Column = {
  id: string;
  name: string;
  icon: LucideIcon;
  count?: number;
};

const initialColumns: Column[] = [
  { id: "backlog", name: "Backlog", icon: ClipboardList },
  { id: "todo", name: "To Do", icon: ListTodo },
  { id: "in-progress", name: "In Progress", icon: LoaderCircle },
  { id: "review", name: "Review", icon: Eye },
  { id: "done", name: "Done", icon: CircleCheck },
];

const initialData: Task[] = [
  {
    id: "task-1",
    name: "Research competitor products",
    column: "backlog",
    description: "Analyze top 5 competitors and create comparison matrix",
    priority: "low",
    assignee: { name: "John Doe", avatar: "https://github.com/shadcn.png" },
    tags: ["research"],
    dueDate: "2024-02-15",
  },
  {
    id: "task-2",
    name: "Design system updates",
    column: "todo",
    description: "Update color tokens and typography scale",
    priority: "medium",
    assignee: { name: "Jane Smith", avatar: "https://github.com/shadcn.png" },
    tags: ["design", "ui"],
    dueDate: "2024-02-20",
  },
  {
    id: "task-3",
    name: "Implement authentication flow",
    column: "in-progress",
    description: "Add OAuth2 support with Google and GitHub providers",
    priority: "high",
    assignee: { name: "Alex Johnson", avatar: "https://github.com/shadcn.png" },
    tags: ["backend", "security"],
    dueDate: "2024-02-10",
  },
  {
    id: "task-4",
    name: "Write API documentation",
    column: "in-progress",
    description: "Document all REST endpoints with examples",
    priority: "medium",
    assignee: { name: "Maria Garcia", avatar: "https://github.com/shadcn.png" },
    tags: ["docs"],
    dueDate: "2024-02-18",
  },
  {
    id: "task-5",
    name: "Fix navigation bug on mobile",
    column: "review",
    description: "Menu doesn't close when clicking outside on iOS Safari",
    priority: "urgent",
    assignee: { name: "Tom Wilson", avatar: "https://github.com/shadcn.png" },
    tags: ["bug", "mobile"],
    dueDate: "2024-02-08",
  },
  {
    id: "task-6",
    name: "Setup CI/CD pipeline",
    column: "done",
    description: "Configure GitHub Actions for automated deployments",
    priority: "high",
    assignee: { name: "Sarah Lee", avatar: "https://github.com/shadcn.png" },
    tags: ["devops"],
    dueDate: "2024-02-01",
  },
  {
    id: "task-7",
    name: "User onboarding flow",
    column: "todo",
    description: "Create step-by-step onboarding for new users",
    priority: "high",
    assignee: { name: "John Doe", avatar: "https://github.com/shadcn.png" },
    tags: ["feature", "ux"],
    dueDate: "2024-02-25",
  },
  {
    id: "task-8",
    name: "Performance optimization",
    column: "backlog",
    description: "Reduce initial bundle size by 30%",
    priority: "medium",
    assignee: { name: "Jane Smith", avatar: "https://github.com/shadcn.png" },
    tags: ["performance"],
    dueDate: "2024-03-01",
  },
];

const priorityColors = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function KanbanPage() {
  const [data, setData] = useState<Task[]>(initialData);
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);
    const overColumn = initialColumns.find((col) => col.id === over.id);

    if (activeItem && (overItem || overColumn)) {
      const newData = data.map((item) => {
        if (item.id === active.id) {
          return {
            ...item,
            column: overItem?.column || overColumn?.id || item.column,
          };
        }
        return item;
      });
      setData(newData);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <KanbanProvider
        columns={initialColumns}
        data={data}
        onDataChange={setData}
        onDragEnd={handleDragEnd}
        className="min-h-[500px]"
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <column.icon className="h-4 w-4" />
                {column.name}
              </span>
              <Badge variant="secondary">{data.filter((task) => task.column === column.id).length}</Badge>
            </KanbanHeader>
            <KanbanCards<Task> id={column.id}>
              {(item) => (
                <KanbanCard<Task> key={item.id} {...item}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{item.name}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.description && (
                      <p className="line-clamp-2 text-muted-foreground text-xs">{item.description}</p>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {item.assignee && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={item.assignee.avatar} alt={item.assignee.name} />
                          <AvatarFallback className="text-xs">
                            {item.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {item.priority && <Badge className={priorityColors[item.priority]}>{item.priority}</Badge>}
                    </div>
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
}
