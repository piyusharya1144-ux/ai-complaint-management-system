const router    = require("express").Router();
const Complaint = require("../models/Complaint");
const User      = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

// All complaints
router.get("/complaints", protect, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update complaint status / note
router.put("/complaints/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNote, priority } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, priority },
      { new: true }
    ).populate("user", "name email");
    res.json(complaint);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete complaint
router.delete("/complaints/:id", protect, adminOnly, async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const total      = await Complaint.countDocuments();
    const open       = await Complaint.countDocuments({ status: "Open" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved   = await Complaint.countDocuments({ status: "Resolved" });
    const closed     = await Complaint.countDocuments({ status: "Closed" });
    const users      = await User.countDocuments({ role: "user" });
    res.json({ total, open, inProgress, resolved, closed, users });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// All users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
