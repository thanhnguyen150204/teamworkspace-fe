'use client'

import { useState } from "react";
import { projectApi } from "@/lib/api/projects";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateProjectDialogProps {
  workspaceId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateProjectDialog({ workspaceId, open, onOpenChange, onSuccess }: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !workspaceId) return;

    setLoading(true);
    try {
      await projectApi.create(workspaceId, { name, description });
      toast.success("Tạo dự án thành công!");
      setName("");
      setDescription("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể tạo dự án.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tạo Dự Án Mới</DialogTitle>
            <DialogDescription>
              Tạo dự án mới trong Workspace để quản lý danh sách công việc và bảng Kanban.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="pj-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Tên Dự Án *
              </label>
              <Input
                id="pj-name"
                placeholder="Ví dụ: Redesign Landing Page, Mobile App v1.0..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="pj-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Mô tả dự án
              </label>
              <Textarea
                id="pj-desc"
                placeholder="Mô tả ngắn gọn về mục tiêu của dự án..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo Dự Án"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
