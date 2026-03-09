const router = require("express").Router();
const { protect } = require("../middleware/auth");
const Complaint = require("../models/Complaint");

const getBotReply = async (message, userId) => {
  const msg = message.toLowerCase().trim();

  if (msg.match(/hi|hello|hey|howdy/))
    return "👋 Hello! I'm your AI assistant. I can help you with complaints, status updates, and more. What do you need?";

  if (msg.match(/how many|count|total/) && msg.match(/complaint/)) {
    const count = await Complaint.countDocuments({ user: userId });
    return `📊 You have **${count}** complaint(s) submitted in total.`;
  }

  if (msg.match(/status|track|progress/) && msg.match(/complaint/)) {
    const complaints = await Complaint.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
    if (!complaints.length) return "You haven't submitted any complaints yet. Go to 'Submit Complaint' to get started!";
    const list = complaints.map(c => `• **${c.title}** → ${c.status}`).join("\n");
    return `📋 Your recent complaints:\n${list}`;
  }

  if (msg.match(/open|pending/)) {
    const count = await Complaint.countDocuments({ user: userId, status: "Open" });
    return `🔴 You have **${count}** open complaint(s) awaiting review.`;
  }

  if (msg.match(/resolved|fixed|done/)) {
    const count = await Complaint.countDocuments({ user: userId, status: "Resolved" });
    return `✅ You have **${count}** resolved complaint(s). Great news!`;
  }

  if (msg.match(/submit|create|new|add/) && msg.match(/complaint/))
    return "📝 To submit a new complaint, click **'Submit Complaint'** in the sidebar. Fill in the title, description, category and priority.";

  if (msg.match(/admin|contact|support|help/))
    return "👨‍💼 Our admin team reviews all complaints within 24 hours. If urgent, mark your complaint as **Critical** priority when submitting.";

  if (msg.match(/delete|remove|cancel/) && msg.match(/complaint/))
    return "🗑️ You cannot delete submitted complaints yourself. Please contact an admin through the complaint description.";

  if (msg.match(/password|account|login|register/))
    return "🔐 For account issues, try logging out and back in. If you forgot your password, contact your system administrator.";

  if (msg.match(/thank|thanks|thx/))
    return "😊 You're welcome! Is there anything else I can help you with?";

  if (msg.match(/bye|goodbye|exit/))
    return "👋 Goodbye! Feel free to come back anytime. Have a great day!";

  return `🤖 I understand you're asking about: "${message}". I can help with complaint status, tracking, submission info, and account questions. Could you be more specific?`;
};

router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "No message provided" });
    const reply = await getBotReply(message, req.user._id);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "Sorry, I'm having trouble right now. Please try again." });
  }
});

module.exports = router;
