import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'

export default function AuthState() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-w-0 items-center gap-2">
      <User className="shrink-0" />
      <span className="truncate text-sm text-[#9B9CA0]">
        {user?.email ?? 'Profile'}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Sign out"
        onClick={() => void signOut()}
      >
        <LogOut size={16} />
      </Button>
    </div>
  )
}
