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
    // User who reported - stores session user id (ObjectId string or OAuth UUID)
    reportedBy: { type: String },

    // Field Agent Assignment
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },

    // Resource Allocation
    allocatedResources: [
      {
        resourceId: { type: Schema.Types.ObjectId, ref: "Resource" },
        name: { type: String }, // Store name for easier display
        quantity: { type: Number, required: true },
      }
    ],

    fieldReport: { type: String, enum: ["controlled", "out_of_control"] },
    status: { type: String, default: "pending", enum: ["pending", "verified", "assigned", "in_progress", "resolved", "completed"] },

    // ------------------------------------------
    // New Fields for Automated Verification & Scoring
    // ------------------------------------------
    urgencyScore: { type: Number, default: 0 },
    reportCount: { type: Number, default: 1 },
    verified: { type: Boolean, default: false },
    source: { type: String, enum: ['user', 'api'], default: 'user' },
    externalId: { type: String }, // For USGS/OpenWeather linking
  },
  { timestamps: true }
);

// Avoid using cached model with old schema (e.g. ObjectId) after schema change
if (models.Incident) delete models.Incident;
export default mongoose.model("Incident", IncidentSchema);
