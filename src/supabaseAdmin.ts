import { createClient } from '@supabase/supabase-js'

// CMS client — holds auth session, sees all articles
export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)