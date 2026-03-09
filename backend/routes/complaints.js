const router    = require("express").Router();
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/auth");

// Get my complaints
router.get("/", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Submit complaint
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const complaint = await Complaint.create({ title, description, category, priority, user: req.user._id });
    res.status(201).json(complaint);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single complaint
router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user._id });
    if (!complaint) return res.status(404).json({ message: "Not found" });
    res.json(complaint);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
