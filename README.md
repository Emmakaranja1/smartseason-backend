# 🌾 SmartSeason Field Monitoring System - Backend API

## 📌 Overview

SmartSeason is a backend API designed to help agricultural teams track crop progress across multiple fields during a growing season.

It supports **Admins (Coordinators)** and **Field Agents** with clear role-based access, field tracking, update workflows, and computed insights.

---

## 🚀 Tech Stack

* **Node.js** + Express
* **PostgreSQL**
* **Prisma ORM**
* **JWT Authentication**
* **bcrypt (password hashing)**

---

## 🧠 System Design

Clean architecture with separation of concerns:

```
src/
  controllers/   # HTTP layer only
  services/      # business logic
  routes/        # API routes
  middleware/    # auth + error handling
  prisma/        # schema + client
  utils/         # helpers
```

---

## 👥 Users & Access Control

### Roles

#### 🔐 Admin (Coordinator)

* Full system access
* Manage fields
* Assign agents
* View all updates across agents
* Access system-wide dashboard

#### 🌱 Field Agent

* Access only assigned fields
* Update field stages
* Add observations
* Access personal dashboard

### Authentication

* JWT-based authentication
* Protected routes require valid token
* Role-based authorization enforced

---

## 🌾 Field Management

Admins can:

* Create fields
* Update fields
* Delete fields
* Assign fields to field agents

Each field contains:

* Name
* Crop type
* Planting date
* Current stage
* Assigned agent

---

## 📝 Field Updates

Field Agents can:

* Update field stage
* Add notes/observations

Admins can:

* View all field updates
* Monitor activity across agents

---

## 🌱 Field Stages

Lifecycle:

* Planted
* Growing
* Ready
* Harvested

Validation ensures only valid stages are accepted.

---

## ⚙️ Field Status Logic (Core Business Logic)

Each field has a **computed status** (not stored in DB).

### ✅ Active

* Field is not harvested
* Last update within 7 days

### ⚠️ At Risk

* No updates for more than 7 days
* OR stage duration exceeds reasonable thresholds

### 🏁 Completed

* Stage = Harvested

### 🧠 Approach

* Status is calculated dynamically in the service layer
* Based on:

  * latest update timestamp
  * current stage
  * planting date
* This avoids stale data and keeps logic centralized

---

## 📊 Dashboard

### Admin Dashboard

Provides:

* Total fields
* Active fields
* At risk fields
* Completed fields
* Fields per agent
* Agent activity (updates count)

### Field Agent Dashboard

Provides:

* Assigned fields
* Status breakdown
* Fields needing attention (at risk)
* Recent updates

---

## 🗄️ Database Schema

### User

* id
* name
* email
* password
* role

### Field

* id
* name
* cropType
* plantingDate
* currentStage
* assignedAgentId

### FieldUpdate

* id
* fieldId
* agentId
* stage
* notes
* createdAt

---

## 📡 API Endpoints

### Auth

* POST /api/auth/login
* POST /api/auth/logout

### Users (Admin)

* GET /api/users
* POST /api/users

### Fields

* POST /api/fields
* GET /api/fields
* GET /api/fields/:id
* PUT /api/fields/:id
* DELETE /api/fields/:id

### Field Updates

* POST /api/fields/:id/updates
* GET /api/fields/:id/updates (Admin monitoring)

### Dashboard

* GET /api/dashboard/admin
* GET /api/dashboard/agent

---

## ⚠️ Error Handling

Consistent response format:

```json
{
  "error": "message"
}
```

Handled cases:

* Unauthorized (401)
* Forbidden (403)
* Not Found (404)
* Validation errors (400)

---

## 🛠️ Setup Instructions

### 1. Clone Repository

```bash
git clone <repo-url>
cd smartseason-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/smartseason_db
JWT_SECRET=your_secret
PORT=5000
```

### 4. Run Migrations

```bash
npx prisma migrate dev
```

### 5. Start Server

```bash
npm run dev
```



## 📦 Deployment

* Render






## 💡 Summary

This backend demonstrates:

* Clean system design
* Core business logic implementation
* Role-based access control
* Dashboard analytics
* Scalable API architecture

---

**SmartSeason – Empowering smarter agricultural decisions.**
