import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = 'https://qknsobdwmngzyriptptd.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrbnNvYmR3bW5nenlyaXB0cHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMTQ1MDUsImV4cCI6MjEwODU5MDUwNX0.w-yF9dPQthyXtIfNy-oktguIx0JHRc2F-QoH4xS5n64'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
