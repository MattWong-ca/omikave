'use client';
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

interface Webhook {
  data: {
    segments?: unknown;
  };
  timestamp: string;
}

export default function Home() {

  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  const handleScreenCapture = async () => {
    try {
      const element = document.documentElement;
      const canvas = await html2canvas(element);
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      
      const url = window.URL.createObjectURL(blob as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transcript-${new Date().toISOString()}.png`;
      link.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error capturing screen:', error);
    }
  };

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-center text-white">Omi Transcripts</h1>
        <button 
          onClick={handleScreenCapture}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors"
        >
          📸 Save Screenshot
        </button>
      </div>
      
      <div className="space-y-4">
        {['SPEAKER_01', 'SPEAKER_02', 'SPEAKER_03'].map((speakerName) => (
          <div key={speakerName} className="border-2 border-black p-4 rounded-xl shadow bg-white">
            <div className="font-bold text-sm text-gray-500">
              {speakerName}
            </div>
            <pre className="mt-2 bg-gray-100 p-2 rounded whitespace-pre-wrap break-words">
              {[...webhooks].reverse().flatMap(webhook => {
                const segments = webhook.data?.segments;
                if (segments && Array.isArray(segments)) {
                  const speakerSegments = segments
                    .filter((segment: { speaker: string }) => segment.speaker === speakerName)
                    .map((segment: { text: string }) => segment.text);
                    console.log(speakerSegments)
                  return speakerSegments;
                }
                return [];
              }).join(' ')}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
