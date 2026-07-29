'use client'

import { useEffect, useState } from "react"
import { useUserStore } from "@/stores/user-store"
import { User } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, UserCheck, ShieldCheck, Loader2 } from "lucide-react"
import { CreateUserDialog } from "./create-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"

export function UserList() {
  const { users, isLoading, fetchUsers, deleteUser } = useUserStore()
  const [search, setSearch] = useState("")
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user)
    setOpenEdit(true)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="size-6 text-blue-400" />
            Quản Lý Người Dùng
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý tài khoản, trạng thái hoạt động và thông tin thành viên hệ thống.
          </p>
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="size-4" />
          Thêm Người Dùng
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 h-9"
          />
        </div>
        <div className="text-xs font-semibold text-slate-300 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
          Tổng cộng: <span className="text-blue-400">{filteredUsers.length}</span> người dùng
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="size-6 animate-spin text-blue-400" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
            <p className="text-sm">Không tìm thấy người dùng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-200">
              <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 border-b border-slate-700/80">
                <tr>
                  <th className="px-6 py-3.5">Người Dùng</th>
                  <th className="px-6 py-3.5">Trạng Thái</th>
                  <th className="px-6 py-3.5">Ngày Tham Gia</th>
                  <th className="px-6 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredUsers.map((u) => {
                  const initials = u.fullName ? u.fullName[0].toUpperCase() : "U"
                  return (
                    <tr key={u.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <Avatar className="size-9 border border-slate-700">
                          <AvatarImage src={u.avatar || undefined} alt={u.fullName} />
                          <AvatarFallback className="bg-blue-600 text-white font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white">{u.fullName}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            u.isActive
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              u.isActive ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                            }`}
                          />
                          {u.isActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="size-8 text-slate-400 hover:text-white cursor-pointer">
                                <MoreVertical className="size-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                            <DropdownMenuItem onClick={() => handleOpenEdit(u)} className="cursor-pointer hover:bg-slate-800">
                              <Edit className="size-4 mr-2 text-blue-400" /> Chỉnh Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteUser(u.id)} className="cursor-pointer hover:bg-slate-800 text-rose-400 focus:text-rose-300">
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

      <CreateUserDialog open={openCreate} onOpenChange={setOpenCreate} />
      <EditUserDialog user={selectedUser} open={openEdit} onOpenChange={setOpenEdit} />
    </div>
  )
}
