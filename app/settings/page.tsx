'use client'

import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"
import { usersApi } from "@/lib/api/users"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@/types/user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User as UserIcon,
  Upload,
  Shield,
  Users,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { CreateUserDialog } from "@/components/features/user/create-user-dialog"
import { EditUserDialog } from "@/components/features/user/edit-user-dialog"

export default function SettingsPage() {
  const router = useRouter()
  const { user, fetchMe } = useAuthStore()
  const { users, isLoading: isUsersLoading, fetchUsers, deleteUser } = useUserStore()

  const [tab, setTab] = useState<"profile" | "security" | "users">("profile")

  // Profile Form
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)

  // Avatar Upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Password Change
  const [password, setPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  // User Management
  const [search, setSearch] = useState("")
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setEmail(user.email || "")
    }
  }, [user])

  useEffect(() => {
    if (tab === "users") {
      fetchUsers()
    }
  }, [tab, fetchUsers])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    try {
      await usersApi.updateAvatar(file)
      await fetchMe()
      toast.success("Cập nhật Avatar thành công")
    } catch {
      toast.error("Tải ảnh avatar thất bại")
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !fullName.trim()) return

    setSavingProfile(true)
    try {
      await usersApi.update(user.id, { fullName, email })
      await fetchMe()
      toast.success("Cập nhật thông tin thành công")
    } catch {
      toast.error("Không thể lưu thông tin")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !password.trim()) return

    setSavingPassword(true)
    try {
      await usersApi.update(user.id, { password })
      setPassword("")
      toast.success("Đổi mật khẩu thành công")
    } catch {
      toast.error("Không thể đổi mật khẩu")
    } finally {
      setSavingPassword(false)
    }
  }

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="bg-card border-border text-foreground hover:bg-muted cursor-pointer shadow-xs"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Cài Đặt Tài Khoản</h1>
              <p className="text-sm text-muted-foreground">Quản lý hồ sơ cá nhân, đổi avatar và danh sách người dùng.</p>
            </div>
          </div>
        </div>

        {/* User Card Banner with App's Teal Gradient Theme */}
        {user && (
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 text-white border border-teal-600/30 shadow-lg">
            <div className="relative group">
              <Avatar className="size-20 border-4 border-white/30 shadow-md">
                <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold backdrop-blur-md">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer backdrop-blur-xs"
              >
                {uploadingAvatar ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left flex-1 space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-white">{user.fullName || "User"}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 font-medium">
                  {user.isActive !== false ? "Hoạt động" : "Khóa"}
                </span>
              </div>
              <p className="text-sm text-cyan-100">{user.email}</p>
              {user.createdAt && (
                <p className="text-xs text-cyan-100/80 pt-1">
                  Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 cursor-pointer backdrop-blur-xs shadow-xs"
            >
              <Upload className="size-4" /> Đổi Avatar
            </Button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex gap-2 bg-muted/70 p-1.5 rounded-xl border border-border flex-wrap">
          <Button
            variant="ghost"
            onClick={() => setTab("profile")}
            className={`gap-2 cursor-pointer transition-all ${
              tab === "profile" 
                ? "bg-card text-teal-700 dark:text-teal-400 font-bold shadow-xs border border-border/80" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserIcon className="size-4" /> Hồ Sơ & Avatar
          </Button>

          <Button
            variant="ghost"
            onClick={() => setTab("security")}
            className={`gap-2 cursor-pointer transition-all ${
              tab === "security" 
                ? "bg-card text-teal-700 dark:text-teal-400 font-bold shadow-xs border border-border/80" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="size-4" /> Bảo Mật & Mật Khẩu
          </Button>

          <Button
            variant="ghost"
            onClick={() => setTab("users")}
            className={`gap-2 cursor-pointer transition-all ${
              tab === "users" 
                ? "bg-card text-teal-700 dark:text-teal-400 font-bold shadow-xs border border-border/80" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4" /> Quản Lý Người Dùng
          </Button>
        </div>

        {/* Tab 1: Profile Form */}
        {tab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-5 bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-xs">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <UserIcon className="size-5 text-teal-600 dark:text-teal-400" /> Thông Tin Cá Nhân
            </h3>

            <div className="space-y-1.5">
              <Label className="text-foreground font-medium">Họ và tên</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground font-medium">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={savingProfile || !fullName.trim()}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-xs"
            >
              {savingProfile ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              {savingProfile ? "Đang lưu..." : "Cập Nhật Hồ Sơ"}
            </Button>
          </form>
        )}

        {/* Tab 2: Security Form */}
        {tab === "security" && (
          <form onSubmit={handleUpdatePassword} className="max-w-xl space-y-5 bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-xs">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="size-5 text-teal-600 dark:text-teal-400" /> Đổi Mật Khẩu
            </h3>

            <div className="space-y-1.5">
              <Label className="text-foreground font-medium">Mật khẩu mới</Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={savingPassword || !password.trim()}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-xs"
            >
              {savingPassword ? <Loader2 className="size-4 animate-spin" /> : <Shield className="size-4" />}
              {savingPassword ? "Đang lưu..." : "Cập Nhật Mật Khẩu"}
            </Button>
          </form>
        )}

        {/* Tab 3: Users Management Table */}
        {tab === "users" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background border-input text-foreground h-9"
                />
              </div>
              <Button
                onClick={() => setOpenCreate(true)}
                className="gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white cursor-pointer shadow-xs"
              >
                <Plus className="size-4" /> Thêm Người Dùng
              </Button>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
              {isUsersLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="size-6 animate-spin text-teal-600" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                  <p className="text-sm">Không tìm thấy người dùng nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-foreground">
                    <thead className="text-xs uppercase bg-muted/60 text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-6 py-3.5">Người Dùng</th>
                        <th className="px-6 py-3.5">Trạng Thái</th>
                        <th className="px-6 py-3.5">Ngày Tham Gia</th>
                        <th className="px-6 py-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map((u) => {
                        const init = u.fullName ? u.fullName[0].toUpperCase() : "U"
                        return (
                          <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <Avatar className="size-9 border border-border">
                                <AvatarImage src={u.avatar || undefined} alt={u.fullName} />
                                <AvatarFallback className="bg-teal-600 text-white font-bold">
                                  {init}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-foreground">{u.fullName}</div>
                                <div className="text-xs text-muted-foreground">{u.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                  u.isActive !== false
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {u.isActive !== false ? "Hoạt động" : "Bị khóa"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-muted-foreground">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground cursor-pointer">
                                      <MoreVertical className="size-4" />
                                    </Button>
                                  }
                                />
                                <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                                  <DropdownMenuItem onClick={() => { setSelectedUser(u); setOpenEdit(true); }} className="cursor-pointer">
                                    <Edit className="size-4 mr-2 text-teal-600 dark:text-teal-400" /> Chỉnh Sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteUser(u.id)} className="cursor-pointer text-rose-600 dark:text-rose-400">
                                    <Trash2 className="size-4 mr-2" /> Vô Hiệu Hóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CreateUserDialog open={openCreate} onOpenChange={setOpenCreate} />
      <EditUserDialog user={selectedUser} open={openEdit} onOpenChange={setOpenEdit} />
    </div>
  )
}
