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
                webhook.data.segments.reduce((acc, segment, index, array) => {
                  const prevSpeaker = index > 0 ? array[index - 1].speaker : null;
                  const text = `${segment.speaker}: ${segment.text}`;
                  
                  return acc + (prevSpeaker === segment.speaker ? ' ' : '\n') + text;
                }, '').trim()
                : null
              }
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
