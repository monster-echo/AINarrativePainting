import type { NextConfig } from "next"
import { Dify_API_URL } from "./config"

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "app.json": ["app/api/apps/app.json"],
  },

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
      // {
      //   source: "/api/files/:id/file-preview",
      //   destination: `${Dify_API_URL}/files/:id/file-preview`,
      // },
      {
        source: "/console/api/:path*",
        destination: `${Dify_API_URL}/console/api/:path*`,
      },
    ]
  },
}

export default nextConfig
