import { NextRequest } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const redis = getRedisClient();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

      // Poll for new signals (simple polling for SSE without Redis Pub/Sub)
      // For production, you'd use Redis Pub/Sub, but this works for basic use
      let lastCheck = Date.now();
      const interval = setInterval(async () => {
        try {
          // Get all signals created since last check
          const signals = await redis.keys('signal:*');
          for (const key of signals) {
            const signalData = await redis.get(key);
            if (signalData) {
              const signal = JSON.parse(signalData as string);
              if (new Date(signal.createdAt).getTime() > lastCheck) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'new-signal', signal })}\n\n`));
              }
            }
          }
          lastCheck = Date.now();
        } catch (e) {
          console.error('SSE poll error:', e);
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
