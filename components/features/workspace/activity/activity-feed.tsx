'use client'

import { useEffect, useState } from "react"
import { activityApi } from "@/lib/api/activity"
import { Activity } from "@/types/activity"
import { toast } from "sonner"
import {
  Activity as ActivityIcon,
  Plus, Pencil, Trash2, LogIn, LogOut,
  FolderKanban, CheckSquare, MessageSquare, Paperclip, Building2,
  Loader2,
} from "lucide-react"

const ACTION_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  CREATE: { label: "đã tạo",        icon: Plus,    className: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" },
  UPDATE: { label: "đã cập nhật",   icon: Pencil,  className: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
  DELETE: { label: "đã xóa",        icon: Trash2,  className: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400" },
  LOGIN:  { label: "đã đăng nhập",  icon: LogIn,   className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  LOGOUT: { label: "đã đăng xuất",  icon: LogOut,  className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
}

const ENTITY_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  WORKSPACE:  { label: "workspace",      icon: Building2 },
  PROJECT:    { label: "project",        icon: FolderKanban },
  TASK:       { label: "task",           icon: CheckSquare },
  COMMENT:    { label: "comment",        icon: MessageSquare },
  ATTACHMENT: { label: "tệp đính kèm",   icon: Paperclip },
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "vừa xong"
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ngày trước`
  return new Date(dateStr).toLocaleDateString("vi-VN")
}

interface ActivityFeedProps {
  workspaceId: number
}

export function ActivityFeed({ workspaceId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [entityFilter, setEntityFilter] = useState<string>("ALL")

  const fetchActivities = async () => {
    try {
      const data = await activityApi.getWorkspaceActivity(workspaceId) as any as Activity[]
      setActivities(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Không thể tải hoạt động")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [workspaceId])

  const filtered = entityFilter === "ALL"
    ? activities
    : activities.filter(a => a.entityType === entityFilter)

  const entityTypes = Object.keys(ENTITY_CONFIG)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ActivityIcon className="size-5" />
            Hoạt Động
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} hoạt động</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setEntityFilter("ALL")}
          className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
            entityFilter === "ALL"
              ? "bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
          }`}
        >
          Tất cả

        </button>
        {Object.entries(ENTITY_CONFIG).map(([val, cfg]) => {
          const Icon = cfg.icon
          return (
            <button
              key={val}
              onClick={() => setEntityFilter(val)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                entityFilter === val
                  ? "bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
              }`}
            >
              <Icon className="size-3" />
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Activity list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="size-6 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
          <ActivityIcon className="size-8 opacity-40" />
          <p className="text-sm">Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-1">
            {filtered.map(activity => {
              const actionCfg = ACTION_CONFIG[activity.action] ?? ACTION_CONFIG["UPDATE"]
              const entityCfg = ENTITY_CONFIG[activity.entityType] ?? { label: activity.entityType, icon: ActivityIcon }
              const ActionIcon = actionCfg.icon
              const EntityIcon = entityCfg.icon

              return (
                <div key={activity.id} className="flex items-start gap-4 pl-2">
                  {/* Icon dot */}
                  <div className={`relative z-10 shrink-0 size-5 rounded-full flex items-center justify-center mt-2 ${actionCfg.className}`}>
                    <ActionIcon className="size-2.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm">
                        <span className="font-medium text-slate-800 dark:text-white">
                          User #{activity.userId}
                        </span>
                        {" "}
                        <span className="text-slate-500">{actionCfg.label}</span>
                        {" "}
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <EntityIcon className="size-3.5" />
                          {entityCfg.label} #{activity.entityId}
                        </span>

                        {activity.description && (
                          <p className="text-xs text-slate-400 mt-1">{activity.description}</p>
                        )}

                        {activity.fieldName && (
                          <p className="text-xs text-slate-400 mt-1">
                            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">{activity.fieldName}</span>
                            {activity.oldValue && (
                              <> <span className="line-through">{activity.oldValue}</span> → <span className="text-green-600">{activity.newValue}</span></>
                            )}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
