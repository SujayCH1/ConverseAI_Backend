import { createCheckout } from '@/api/user'
import { useState } from 'react'

export const useSubscription = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const onSubscribe = async () => {
    setIsProcessing(true)
    const response = await createCheckout()
    if (response.status === 200 && response.data?.session_url) {
      return (window.location.href = response.data.session_url)
    }

    setIsProcessing(false)
  }

  return { onSubscribe, isProcessing }
}
