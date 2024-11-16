export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        const data = req.body; // The JSON payload sent by the webhook
        console.log("Webhook Data:", data);
  
        // Optionally, process the data or save it to a database
        // Example: Save to a log file or database
  
        res.status(200).json({ message: "Webhook received successfully!" });
      } catch (error) {
        console.error("Error handling webhook:", error);
        res.status(500).json({ message: "Server error" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
