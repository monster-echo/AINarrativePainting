import type { NextConfig } from "next"
import { API_URL } from "./config"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ]
  },

  rewrites: async () => {
    return [
      // rewrite /api/files/* to http://localhost:3001/files/*
      {
        source: "/api/files/:path*",
        destination: `${API_URL.replace("/v1", "/")}/files/:path*`,
      },
    ]
  },
}

export default nextConfig
