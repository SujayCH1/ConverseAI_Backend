import { onSubscribe } from '@/api/user'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaymentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [failed, setFailed] = useState(searchParams.has('cancel'))

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return
    onSubscribe(sessionId)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => setFailed(true))
  }, [navigate, searchParams])

  if (!failed) return <div className="h-screen flex items-center justify-center">Confirming payment…</div>
  return <div className="h-screen flex flex-col justify-center items-center"><h4 className="text-5xl font-bold">Payment incomplete</h4><p className="text-xl font-bold">Please try again.</p></div>
}
