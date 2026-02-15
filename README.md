# Disaster Management & Resource Allocation System

**Academic Project**: BCA 6th Semester (Tribhuvan University, Nepal)  
**Tech Stack**: Next.js 16, MongoDB, Leaflet.js, NextAuth.js

---

## 📋 Project Overview

A comprehensive web-based platform designed to automate disaster response, monitoring, and resource distribution within the Nepalese context. The system implements core Computer Science algorithms (Dijkstra's Algorithm & Merge Sort) to optimize emergency response operations.

---

## 🎯 Core Features

### 1. **Hybrid Disaster Detection System**
- **Crowdsourcing (User Reports)**: Citizens and field agents report incidents via GPS-enabled forms
- **Automated Verification**: Multiple reports from the same geofence trigger automatic verification
- **External API Integration**: 
  - USGS API for earthquake detection (magnitude-based auto-alerts)
  - OpenWeatherMap API for flood/weather alerts (simulated in demo)

### 2. **Algorithm Implementation (TU BCA Syllabus)**

#### **Dijkstra's Algorithm** (Graph Theory)
- **Purpose**: Shortest path routing for rescue teams
- **Implementation**: `lib/utils.ts` - `dijkstra()` function
- **Usage**: Calculates optimal route from base station to disaster site
- **Visualization**: Interactive map with route overlay in Field Agent Dashboard

#### **Merge Sort** (Divide & Conquer)
- **Purpose**: Critical incident prioritization (Triage)
- **Implementation**: `lib/algorithms.ts` - `mergeSortIncidents()` function
- **Urgency Score Formula**: `(Severity × 10) + (Report Count × 2)`
- **Time Complexity**: O(n log n)
- **Usage**: Admin Dashboard displays incidents sorted by urgency

### 3. **Role-Based Access Control**
- **Citizen**: Report incidents, view public information
- **Field Agent/Dispatcher**: View assigned missions, update status, access route optimization
- **Administrator**: Full system access, assign resources, manage users, trigger API scans

### 4. **Real-Time Resource Management**
- Track ambulances, medical supplies, personnel, and equipment
- Inventory depletion alerts
- Resource allocation to specific incidents
- Prevents over-allocation through validation

### 5. **Interactive Geospatial Features**
- Leaflet.js map integration
- Click-to-report incident location
- Live incident markers with severity indicators
- Route visualization (Dijkstra + OpenRouteService API)
- Geofencing for duplicate detection

---

## 🗄️ Database Schema (MongoDB)

### **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ["user", "field_agent", "dispatcher", "Admin"]),
  createdAt: Date,
  updatedAt: Date
}
```

### **Incidents Collection**
```javascript
{
  _id: ObjectId,
  disasterType: String,
  severity: Number (1-5),
  description: String,
  location: { lat: Number, lng: Number },
  address: String,
  reportedBy: String (User ID),
  assignedTo: ObjectId (ref: User),
  allocatedResources: [
    { resourceId: ObjectId, name: String, quantity: Number }
  ],
  status: String (enum: ["pending", "verified", "assigned", "in_progress", "resolved", "completed"]),
  fieldReport: String (enum: ["controlled", "out_of_control"]),
  urgencyScore: Number,
  reportCount: Number,
  verified: Boolean,
  source: String (enum: ["user", "api"]),
  externalId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Resources Collection**
```javascript
{
  _id: ObjectId,
  name: String (unique),
  type: String (enum: ["Vehicle", "Equipment", "Personnel", "Supply"]),
  quantity: Number,
  unit: String,
  status: String (enum: ["Available", "Depleted"]),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 System Workflow

### **Step 1: Detection**
- User reports incident via `/NavPages/ReportIncident` OR
- Automated detection via `/api/cron/detect` (USGS/Weather APIs)

### **Step 2: Verification & Clustering**
- System checks for nearby incidents (500m radius)
- If duplicate found: Increment `reportCount`, update urgency
- If `reportCount >= 2`: Auto-verify incident

### **Step 3: Prioritization (Merge Sort)**
- Admin Dashboard fetches incidents via `/api/reports`
- Backend applies Merge Sort based on `urgencyScore`
- High-severity, multi-reported incidents appear first

### **Step 4: Assignment**
- Admin selects incident → Clicks "Assign"
- Selects Field Agent from dropdown
- Allocates resources (ambulances, supplies, etc.)
- System updates incident status to "assigned"

### **Step 5: Routing (Dijkstra's Algorithm)**
- Field Agent views assignment in Dashboard
- System calculates shortest path using Dijkstra
- Displays route on interactive map
- Shows distance in kilometers

### **Step 6: Execution & Completion**
- Field Agent reaches site, provides status update
- Marks incident as "controlled" or "out_of_control"
- System archives completed missions

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd disaster-management-system
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure Environment Variables**
Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/disaster-management
AUTH_SECRET=your-secret-key-here
AUTH_TRUST_HOST=true
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Access the Application**
- Open [http://localhost:3000](http://localhost:3000)
- Register as a Citizen
- Admin must manually promote users to Field Agent/Dispatcher roles via User Management page

---

## 📂 Project Structure

```
disaster-management-system/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── incidents/     # Incident CRUD operations
│   │   ├── reports/       # Incident reporting (with Merge Sort)
│   │   ├── resources/     # Resource management
│   │   ├── users/         # User management
│   │   └── cron/detect/   # External API detection
│   ├── NavPages/
│   │   ├── Dashboard/     # Admin & Field Agent dashboards
│   │   ├── ReportIncident/# Incident reporting form
│   │   ├── User/          # User management (Admin only)
│   │   └── ...
│   └── Utilities/
│       ├── Map.tsx        # Leaflet map component
│       └── RouteMap.tsx   # Route visualization
├── lib/
│   ├── algorithms.ts      # Merge Sort implementation
│   ├── utils.ts           # Dijkstra's Algorithm
│   ├── mongodb.ts         # Database connection
│   └── models/            # Mongoose schemas
└── package.json
```

---

## 🔐 Security Features

1. **Role-Based Access Control**: NextAuth.js with custom role validation
2. **Password Hashing**: bcryptjs (12 rounds)
3. **Public Registration Restriction**: Only "Citizen" role allowed via signup
4. **Admin-Only Promotion**: Field Agents/Dispatchers must be promoted manually
5. **API Route Protection**: Session validation on sensitive endpoints

---

## 🧪 Testing the System

### **Test Scenario 1: Crowdsourcing Verification**
1. Register 2 different user accounts
2. Both users report a "Fire" incident at the same location (click same spot on map)
3. Check Admin Dashboard → Incident should be auto-verified with `reportCount: 2`

### **Test Scenario 2: Dijkstra Routing**
1. Admin assigns an incident to a Field Agent
2. Field Agent logs in → Views Dashboard
3. System displays shortest path from base to incident site
4. Distance calculated using Haversine formula

### **Test Scenario 3: Merge Sort Prioritization**
1. Create 5 incidents with varying severities (1-5)
2. Admin Dashboard should display them in descending urgency order
3. Severity 5 incidents appear first

### **Test Scenario 4: External API Detection**
1. Admin clicks "Scan EXT APIs (USGS)" button
2. System simulates earthquake detection (70% random chance)
3. If detected, new incident auto-created with `source: "api"`

---

## 📊 Algorithm Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|------------------|----------|
| Dijkstra's Algorithm | O((V + E) log V) | O(V) | Shortest path routing |
| Merge Sort | O(n log n) | O(n) | Incident prioritization |
| Haversine Distance | O(1) | O(1) | Geospatial calculations |

---

## 🎓 Academic Compliance

This project fulfills the following BCA 6th Semester requirements:

✅ **Algorithm Implementation**: Dijkstra's Algorithm (Graph Theory) + Merge Sort (Divide & Conquer)  
✅ **Database Design**: Normalized MongoDB schema with relationships  
✅ **Full-Stack Development**: Next.js (Frontend + Backend API)  
✅ **Real-World Problem Solving**: Disaster response automation  
✅ **External API Integration**: USGS/OpenWeatherMap simulation  
✅ **Authentication & Authorization**: NextAuth.js with role-based access  

---

## 🛠️ Future Enhancements

1. **Offline-First PWA**: Service Workers for offline incident reporting
2. **WebSocket Integration**: Real-time dashboard updates
3. **SMS Gateway**: Twilio integration for SMS-based reporting
4. **Machine Learning**: Predict disaster-prone zones using historical data
5. **Mobile App**: React Native companion app for field agents
6. **Multi-Language Support**: Nepali/English localization

---

## 📝 License

This is an academic project developed for educational purposes.

---

## 👥 Contributors

- **Developer**: [Your Name]
- **Institution**: Tribhuvan University
- **Course**: BCA 6th Semester
- **Year**: 2026

---

## 📞 Support

For academic inquiries or technical support, contact: [your-email@example.com]
