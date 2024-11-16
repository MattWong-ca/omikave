// Store webhooks in memory (note: this will reset when the server restarts)
let webhookHistory = [];

export async function POST(req) {
  try {
    const data = await req.json();
    const timestamp = new Date().toISOString();
    
    // Store webhook data
    webhookHistory.unshift({ timestamp, data }); // Add new webhooks at the start
    // Keep only last 50 webhooks
    webhookHistory = webhookHistory.slice(0, 50);
    
    console.log('📥 New webhook:', { timestamp, data });

    return new Response(JSON.stringify({ message: "Webhook received successfully!" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 200 });
  }
}

// Add GET method to retrieve webhook history
export async function GET() {
  return new Response(JSON.stringify(webhookHistory), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}