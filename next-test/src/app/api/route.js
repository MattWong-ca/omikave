export async function POST(req) {
  try {
    console.log("received")
    const data = await req.json();
    console.log("Webhook Data:", data);

    return new Response(JSON.stringify({ message: "Testing!" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}