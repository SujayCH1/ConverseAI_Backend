import { onIntegrate } from '@/api/integrations'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function InstagramCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')?.split('#_')[0]
    if (!code) {
      navigate('/sign-up', { replace: true })
      return
    }

    onIntegrate(code)
      .then(() => navigate('/dashboard/workspace/integrations', { replace: true }))
      .catch(() => navigate('/dashboard/workspace/integrations', { replace: true }))
  }, [navigate, searchParams])

  return <div className="h-screen flex items-center justify-center">Connecting Instagram…</div>
}
