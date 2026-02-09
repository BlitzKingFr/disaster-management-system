import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import Resource from "../lib/models/Resource";

const resources = [
    // Vehicles
    { name: "Fire Truck", type: "Vehicle", quantity: 5, unit: "units" },
    { name: "Ambulance", type: "Vehicle", quantity: 8, unit: "units" },
    { name: "Rescue Helicopter", type: "Vehicle", quantity: 2, unit: "units" },
    { name: "Search & Rescue Boat", type: "Vehicle", quantity: 4, unit: "units" },
    { name: "Emergency Response SUV", type: "Vehicle", quantity: 10, unit: "units" },

    // Equipment
    { name: "Portable Power Generator", type: "Equipment", quantity: 15, unit: "units" },
    { name: "Industrial Water Pump", type: "Equipment", quantity: 10, unit: "units" },
    { name: "Heavy Duty Shelter Tent", type: "Equipment", quantity: 50, unit: "units" },
    { name: "Chainsaw (Heavy Duty)", type: "Equipment", quantity: 12, unit: "units" },
    { name: "Hydraulic Rescue Tool", type: "Equipment", quantity: 5, unit: "units" },

    // Personnel
    { name: "Medical Response Team", type: "Personnel", quantity: 6, unit: "teams" },
    { name: "Search & Rescue Unit", type: "Personnel", quantity: 4, unit: "units" },
    { name: "Firefighting Squad", type: "Personnel", quantity: 8, unit: "squads" },
    { name: "General Volunteer Group", type: "Personnel", quantity: 20, unit: "groups" },

    // Supplies
    { name: "Emergency Food Ration (Bulk)", type: "Supply", quantity: 500, unit: "kits" },
    { name: "Bottled Water Case (24pk)", type: "Supply", quantity: 1000, unit: "cases" },
    { name: "First Aid & Trauma Kit", type: "Supply", quantity: 200, unit: "kits" },
    { name: "Emergency Wool Blanket", type: "Supply", quantity: 300, unit: "units" },
    { name: "Sanitation & Hygiene Pack", type: "Supply", quantity: 150, unit: "packs" }
];

async function seed() {
    try {
        console.log("Connecting to database...");
        await connectDB();

        console.log("Cleaning existing resources...");
        await Resource.deleteMany({});

        console.log(`Seeding ${resources.length} resources...`);
        await Resource.insertMany(resources);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed();
