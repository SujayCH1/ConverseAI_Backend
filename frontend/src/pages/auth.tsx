import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Google } from '@/icons'
import { useAuth } from '@/providers/auth-provider'

export default function AuthPage() {
  const { isLoading, session, signInWithGoogle } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading…</div>
  }

  if (session) {
    return <Navigate to="/dashboard/workspace" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-[#333336] bg-[#171717] p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Sign in to ConverseAI</h1>
          <p className="text-sm text-[#9B9CA0]">
            Continue with Google to access your workspace.
          </p>
        </div>
        <Button
          className="w-full gap-2"
          onClick={() => void signInWithGoogle()}
        >
          <Google />
          Continue with Google
        </Button>
      </div>
    </main>
  )
}
