'use client'

import { FolderKanban, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";

interface ProjectCardProps {
  workspaceId: number;
  project: Project;
}

export function ProjectCard({ workspaceId, project }: ProjectCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dashboard/workspace/${workspaceId}/projects/${project.id}`)}
      className="group cursor-pointer p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-md transition-all space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <FolderKanban className="size-5" />
        </div>
        <ArrowRight className="size-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </div>

      <div>
        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
          {project.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
          {project.description || "Không có mô tả cho dự án này."}
        </p>
      </div>
    </div>
  );
}
