'use client'
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/features/auth/login-form"
import Image from "next/image"
import loginImg from "@/Images/login-page.jpg"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background">
      <div className="flex flex-col gap-6 p-6 md:p-10 justify-between bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        {/* Luminous blue background glow */}
        <div className="absolute -top-20 -left-20 size-96 rounded-full bg-blue-600/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 size-96 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />

        <div className="flex justify-center gap-2 md:justify-start relative z-10">
          <a href="#" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent font-bold">
              Team Workspace
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center py-6 relative z-10">
          <div className="w-full max-w-md bg-white text-slate-900 p-8 md:p-10 rounded-2xl border border-blue-400/20 shadow-2xl shadow-black/80">
            <LoginForm />
          </div>
        </div>
        <div className="text-xs text-center md:text-left text-slate-400 relative z-10">
          © {new Date().getFullYear()} Website was developed by Nguyen Thanh.
        </div>
      </div>
      <div className="relative hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 lg:block overflow-hidden">
        <Image
          src={loginImg}
          alt="Login illustration"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-85 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/30 to-blue-900/10" />
        <div className="absolute bottom-12 left-12 right-12 text-white z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-xs font-medium text-blue-200">
            <span>✨</span> Next-Gen Team Collaboration
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Manage your workspace & projects with confidence.
          </h2>
          <p className="text-blue-100/80 text-sm leading-relaxed max-w-md">
            Empower your team with real-time updates, kanban boards, and intelligent workflow automation.
          </p>
        </div>
      </div>
    </div>
  )
}
