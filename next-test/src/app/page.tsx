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
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#0E76FD' }}>
      <h1 className="text-4xl font-bold mb-4 text-center text-white">Omi Transcripts</h1>
      <div className="space-y-4">
        {['SPEAKER_01', 'SPEAKER_02', 'SPEAKER_03'].map((speakerName) => (
          <div key={speakerName} className="border-2 border-black p-4 rounded-xl shadow bg-white">
            <div className="font-bold text-sm text-gray-500">
              {speakerName}
            </div>
            <pre className="mt-2 bg-gray-100 p-2 rounded whitespace-pre-wrap break-words">
              {[...webhooks].reverse().flatMap(webhook => 
                webhook.data?.segments && Array.isArray(webhook.data.segments) ?
                  webhook.data.segments
                    .filter((segment: { speaker: string }) => segment.speaker === speakerName)
                    .map((segment: { text: string }) => segment.text)
                : []
              ).join(' ')}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
