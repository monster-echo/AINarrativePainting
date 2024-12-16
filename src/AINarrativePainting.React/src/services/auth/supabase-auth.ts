import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ekozcmubgktvttgpisle.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// const supabase = createClient(
//   'http://192.168.1.220:8000',
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )

export default supabase
