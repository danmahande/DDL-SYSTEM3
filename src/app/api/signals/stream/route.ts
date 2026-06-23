import { NextRequest } from "next/server";
import { getRedisClient } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const redis = getRedisClient();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
      );

      let lastCheck = Date.now();
      const interval = setInterval(async () => {
        try {
          const signals = await redis.keys("signal:*");
          for (const key of signals) {
            const signalData = await redis.get(key);
            if (signalData) {
              const signal = JSON.parse(signalData as string);
              if (new Date(signal.createdAt).getTime() > lastCheck) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "new-signal", signal })}\n\n`
                  )
                );
              }
            }
          }
          lastCheck = Date.now();
        } catch (e) {
          console.error("SSE poll error:", e);
        }
      }, 2000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
