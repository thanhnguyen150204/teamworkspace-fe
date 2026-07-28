'use client'

import { useState } from "react";
import { workspaceApi } from "@/lib/api/workspaces";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateWorkspaceDialog({ open, onOpenChange, onSuccess }: CreateWorkspaceDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await workspaceApi.create({ name, description });
      toast.success("Tạo Workspace thành công!");
      setName("");
      setDescription("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể tạo Workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Tạo Workspace Mới</DialogTitle>
          <DialogDescription>
            Tạo không gian làm việc mới để quản lý các dự án và đội nhóm của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <label htmlFor="ws-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Tên Workspace *
            </label>
            <Input
              id="ws-name"
              placeholder="Ví dụ: Team Marketing, Tech Startup..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ws-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Mô tả
            </label>
            <Textarea
              id="ws-desc"
              placeholder="Mô tả ngắn gọn về mục tiêu không gian làm việc..."
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
            {loading ? "Đang tạo..." : "Tạo Workspace"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
