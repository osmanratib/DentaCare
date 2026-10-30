import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://qknsobdwmngzyriptptd.supabase.co'
const DEFAULT_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrbnNvYmR3bW5nenlyaXB0cHRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzAxNDUwNSwiZXhwIjoyMTA4NTkwNTA1fQ.DGXTW57ZFojx0Y9PQWsLGbpIMs4T0mI_sO5aH3Xhr3Y'

/**
 * Service Role client - STRICTLY SERVER ONLY.
 * Never expose NEXT_PUBLIC prefix for the service role key.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
