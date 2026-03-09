#  AI Complaint Management System

A full-stack complaint management system with React, Node.js, MongoDB.

##  Features
- Login / Register with JWT auth
- Submit & track complaints
- Admin panel (manage all complaints, update status, delete)
- AI Chatbot assistant
- Dark / Light theme toggle
- Charts & dashboard stats

---

##  Quick Start (3 steps)

### Step 1 — Make sure MongoDB is running
- Install MongoDB from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud) — update MONGO_URI in backend/.env

### Step 2 — Install dependencies
Open TWO terminal windows.

**Terminal 1 (Backend):**
```
cd backend
npm install
npm start
```
Backend runs on: http://localhost:5000

**Terminal 2 (Frontend):**
```
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

### Step 3 : Open browser
Go to: http://localhost:3000

---

## Create Admin Account
1. Click "Register"
2. Fill in your details
3. Select **Role: Admin** from the dropdown
4. Log in → you'll see "Admin Panel" in the sidebar

## Create User Account
1. Click "Register"
2. Select **Role: User**
3. Log in → submit and track complaints

---

## Project Structure
```
complaint-system/
|--- backend/
│   |--- models/         # MongoDB schemas
│   |---routes/         # API endpoints
│   |--- middleware/      # Auth middleware
│   |---.env            # Config (MongoDB URI, JWT secret)
│   |--- server.js       # Entry point
|---- frontend/
    |--- src/
    │   |--- components/  # Sidebar, Navbar, Chatbot, Layout
    │   |--- context/     # Auth + Theme context
    │   |--- pages/       # Dashboard, Login, Register, etc.
    │   |--- services/    # API calls
    |---- public/
```

---

## Config (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/complaint-system
JWT_SECRET=supersecretjwtkey123456789
```
Change MONGO_URI to your Atlas connection string if using cloud MongoDB.
