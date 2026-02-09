import mongoose, { Schema, models } from "mongoose";

const ResourceSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        type: { type: String, required: true, enum: ["Vehicle", "Equipment", "Personnel", "Supply"] },
        quantity: { type: Number, required: true, default: 0 },
        unit: { type: String, required: true, default: "units" }, // e.g., "units", "teams", "liters"
        status: { type: String, default: "Available", enum: ["Available", "Depleted"] },
    },
    { timestamps: true }
);

// Prevent model overwrite error
if (models.Resource) delete models.Resource;

export default mongoose.model("Resource", ResourceSchema);
