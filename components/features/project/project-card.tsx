'use client'

import { FolderKanban, ArrowRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { useState } from "react";
import { EditProjectDialog } from "./edit-project-dialog";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { WorkspaceRole } from "@/types/enum";
import { projectApi } from "@/lib/api/projects";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  workspaceId: number;
  project: Project;
  onRefresh?: () => void;
}

export function ProjectCard({ workspaceId, project, onRefresh }: ProjectCardProps) {
  const router = useRouter();
  const { myRole, fetchProjects } = useWorkspaceStore();
  const [openEdit, setOpenEdit] = useState(false);

  const canManage = myRole === WorkspaceRole.OWNER || myRole === WorkspaceRole.ADMIN;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Bạn có chắc muốn xóa dự án "${project.name}"? Thao tác này sẽ xóa toàn bộ tasks thuộc dự án.`)) return;

    try {
      await projectApi.delete(workspaceId, project.id);
      toast.success("Đã xóa dự án thành công!");
      await fetchProjects(workspaceId, true);
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa dự án.");
    }
  };

  return (
    <>
      <div
        onClick={() => router.push(`/dashboard/workspace/${workspaceId}/projects/${project.id}`)}
        className="group cursor-pointer p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-md transition-all space-y-3 relative"
      >
        <div className="flex items-center justify-between">
          <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FolderKanban className="size-5" />
          </div>

          <div className="flex items-center gap-1">
            {canManage && (
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                      <Pencil className="size-3.5 mr-2" /> Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                      <Trash2 className="size-3.5 mr-2" /> Xóa dự án
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <ArrowRight className="size-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
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

      <EditProjectDialog
        workspaceId={workspaceId}
        project={project}
        open={openEdit}
        onOpenChange={setOpenEdit}
        onSuccess={() => {
          fetchProjects(workspaceId, true);
          onRefresh?.();
        }}
      />
    </>
  );
}
