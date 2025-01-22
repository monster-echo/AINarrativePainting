import { getApp } from "@/app/services/AppService"
import DifyClient, { DifyAPIError } from "@/app/services/dify"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId: appId } = await params
  const app = getApp(parseInt(appId))
  const client = new DifyClient(app.apiKey, "user-123")

  const body = await request.json()

  const {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    auto_generate_name,
  } = body

  try {
    const stream = new TransformStream({
      transform(chunk, controller) {
        // Encode each chunk as SSE format
        const encoder = new TextEncoder()
        const sseData = `event: ${chunk.event}\ndata: ${JSON.stringify(
          chunk
        )}\n\n`
        controller.enqueue(encoder.encode(sseData))
      },
    })
    const writer = stream.writable.getWriter()
    try {
      for await (const data of client.streamingChatMessage(conversationId, {
        inputs,
        query,
        files,
        auto_generate_name,
      })) {
        writer.write(data)
      }
    } catch (error) {
      writer.write({
        event: "error",
        data: {
          message: (error as any).message,
        },
      })
    } finally {
      writer.close()
    }

    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    }
    return new Response(stream.readable, { headers })
  } catch (error) {
    if (error instanceof DifyAPIError) {
      const { code, message, status } = error
      return NextResponse.json(
        { error: message, code },
        { status: status || 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}
