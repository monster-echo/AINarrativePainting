import { Session } from "@supabase/supabase-js"
import { create } from "zustand"

interface  AuthStore {
    session: Session | null
    setSession: (session: any) => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    session: null,
    setSession: (session: any) => {
        set({ session })
    }
}))