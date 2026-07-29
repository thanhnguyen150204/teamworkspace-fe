'use client'

import { Project } from "@/types/project";
import { ProjectCard } from "./project-card";
import { Plus, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateProjectDialog } from "./create-project-dialog";

interface ProjectListProps {
  workspaceId: number;
  projects: Project[];
  onRefresh?: () => void;
}

export function ProjectList({ workspaceId, projects, onRefresh }: ProjectListProps) {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Danh Sách Dự Án ({projects.length})
        </h2>
        <Button onClick={() => setOpenCreate(true)} size="sm" className="gap-1.5 shadow-sm">
          <Plus className="size-4" /> Tạo Dự Án Mới
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FolderKanban className="size-10 mx-auto text-slate-400 mb-2" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Chưa có dự án nào</h3>
          <p className="text-xs text-slate-500 mb-4">Hãy tạo dự án đầu tiên cho Workspace này.</p>
          <Button size="sm" onClick={() => setOpenCreate(true)}>Tạo Dự Án Ngay</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((pj) => (
            <ProjectCard key={pj.id} workspaceId={workspaceId} project={pj} />
          ))}
        </div>
      )}

      <CreateProjectDialog
        workspaceId={workspaceId}
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={onRefresh}
      />
    </div>
  );
}
