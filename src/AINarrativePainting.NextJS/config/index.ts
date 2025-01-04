import type { AppInfo } from "@/types/app"

const checkNotNull = (value: string | undefined, name: string) => {
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not set`)
  }
  return value
}

export const Dify_API_URL = checkNotNull(
  process.env.Dify_API_URL,
  "Dify_API_URL"
)
export const COS_SecretId = checkNotNull(
  process.env.COS_SecretId,
  "COS_SecretId"
)
export const COS_SecretKey = checkNotNull(
  process.env.COS_SecretKey,
  "COS_Secret"
)
export const COS_Region = checkNotNull(process.env.COS_Region, "COS_Region")
export const COS_Bucket = checkNotNull(process.env.COS_Bucket, "COS_Bucket")

export const ImgProxyUrl = checkNotNull(process.env.ImgProxyUrl, "ImgProxyUrl")


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
