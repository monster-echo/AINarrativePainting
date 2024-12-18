import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROKE_KEY!,
  {
    db: {
      schema: "aishuohua",
    },
  }
)

export default supabase
