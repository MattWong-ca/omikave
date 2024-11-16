'use client';
import { useState, useEffect } from 'react';

interface Webhook {
  data: {
    segments?: unknown;
  };
  timestamp: string;
}

export default function Home() {

  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  // Fetch webhooks on load and every 5 seconds
  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const response = await fetch('/api');
        const data = await response.json();
        setWebhooks(data);
      } catch (error) {
        console.error('Error fetching webhooks:', error);
      }
    };

    // Initial fetch
    fetchWebhooks();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchWebhooks, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Webhook History</h1>
      <div className="space-y-4">
        {webhooks.map((webhook, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <div className="font-bold text-sm text-gray-500">
              {/* {new Date(webhook.timestamp).toLocaleString()} */}
            </div>
            <pre className="mt-2 bg-gray-100 p-2 rounded">
              {webhook.data?.segments && Array.isArray(webhook.data.segments) ? 
                Object.entries(
                  webhook.data.segments.reduce((acc, segment) => {
                    acc[segment.speaker] = acc[segment.speaker] || [];
                    acc[segment.speaker].push(segment.text);
                    return acc;
                  }, {} as Record<string, string[]>)
                )
                .map(([speaker, texts]) => 
                  `${speaker}:\n${(texts as string[]).join(' ')}`
                )
                .join('\n\n')
                : null
              }
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
