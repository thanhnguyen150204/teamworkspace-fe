'use client'

import { Workspace } from "@/types/workspace";
import { WorkspaceCard } from "./workspace-card";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";

interface WorkspaceListProps {
  workspaces: Workspace[];
  onRefresh?: () => void;
}

export function WorkspaceList({ workspaces, onRefresh }: WorkspaceListProps) {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tất Cả Workspace ({workspaces.length})
          </h2>
          <p className="text-sm text-slate-500">Danh sách các không gian làm việc bạn đang tham gia</p>
        </div>
        <Button onClick={() => setOpenCreate(true)} className="gap-2 shadow-sm">
          <Plus className="size-4" /> Tạo Workspace Mới
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <LayoutGrid className="size-12 mx-auto text-slate-400 mb-3" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Chưa có Workspace nào</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
            Hãy tạo Workspace đầu tiên để quản lý các dự án và công việc cùng đồng đội.
          </p>
          <Button onClick={() => setOpenCreate(true)}>Tạo Workspace Ngay</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>
      )}

      <CreateWorkspaceDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={onRefresh}
      />
    </div>
  );
}
