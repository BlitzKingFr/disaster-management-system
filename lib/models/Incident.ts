import mongoose, { Schema, models } from "mongoose";

const IncidentSchema = new Schema(
  {
    disasterType: { type: String, required: true },
    severity: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true },
    
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    // Optional street address or landmark
    address: { type: String, default: "" },
    // User who reported - stores session user id (ObjectId string or OAuth UUID)
    reportedBy: { type: String },
    status: { type: String, default: "pending", enum: ["pending", "verified", "in_progress", "resolved"] },
  },
  { timestamps: true }
);

// Avoid using cached model with old schema (e.g. ObjectId) after schema change
if (models.Incident) delete models.Incident;
export default mongoose.model("Incident", IncidentSchema);
