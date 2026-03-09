const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category:    { type: String, enum: ["Technical", "Billing", "Service", "Product", "Other"], default: "Other" },
  priority:    { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  status:      { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminNote:   { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
