import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/auth/login" className={buttonVariants()}>
        Return to Login
      </Link>
    </div>
  )
}

