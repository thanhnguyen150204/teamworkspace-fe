'use client'

import { Workspace } from "@/types/workspace";
import { FolderKanban, ArrowRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dashboard/workspace/${workspace.id}`)}
      className="group cursor-pointer p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-lg transition-all space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="size-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
          <FolderKanban className="size-6" />
        </div>
        <ArrowRight className="size-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
          {workspace.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
          {workspace.description || "Không có mô tả cho Workspace này."}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 font-medium">
          <Users className="size-3.5 text-blue-500" /> Member Workspace
        </span>
        <span>{new Date(workspace.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>
    </div>
  );
}
