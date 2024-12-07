import { Locale } from "@/i18n"

export type AppInfo = {
  title: string
  description: string
  default_language: Locale
  copyright?: string
  privacy_policy?: string
}
