import { createClient } from '@supabase/supabase-js'

// Get these from your Supabase Settings > API
const supabaseUrl = 'https://bwxqxgjwpsurptaduwii.supabase.co'
const supabasePublishableKey = 'sb_publishable_9PZOHIJ2nWUT9f1ZzNI2Bw__pgRAVTs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
