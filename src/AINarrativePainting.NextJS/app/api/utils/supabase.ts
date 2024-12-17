import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://ekozcmubgktvttgpisle.supabase.co",
  process.env.SUPABASE_SERVICE_ROKE_KEY!,
  {
    db: {
      schema: "aishuohua",
    },
  }
)

export default supabase
