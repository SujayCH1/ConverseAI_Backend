import { createClient } from '@supabase/supabase-js'

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseURL) {
  throw new Error('VITE_SUPABASE_URL is required')
}

if (!supabasePublishableKey) {
  throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY is required')
}

export const supabase = createClient(supabaseURL, supabasePublishableKey)
