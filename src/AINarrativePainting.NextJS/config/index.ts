import type { AppInfo } from "@/types/app"
export const Dify_API_URL = `${process.env.Dify_API_URL}`
export const Supabase_Bucket = `${process.env.Supabase_Bucket}`



export const APP_INFO: AppInfo = {
  title: "Chat APP",
  description: "",
  copyright: "",
  privacy_policy: "",
  default_language: "en",
}

export const isShowPrompt = false
export const promptTemplate = "I want you to act as a javascript console."

export const API_PREFIX = "/api"

export const LOCALE_COOKIE_NAME = "locale"

export const DEFAULT_VALUE_MAX_LEN = 48
