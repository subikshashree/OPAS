# Full Stack Multi-Role Student Management & Leave Automation System

## Setup Instructions

### 1. Database Configuration
1. Open `backend/.env`.
2. Replace `MONGO_URI` with your actual MongoDB Atlas connection string. (e.g., `mongodb+srv://...`)
3. Open a terminal, navigate to the `backend` directory, and run the seeder:
   ```bash
   cd backend
   npm run seed # or node seed.js
   ```
   This will populate your database with test users:
   - `student@test.com`
   - `mentor@test.com`
   - `parent@test.com`
   - `warden@test.com`
   - `hod@test.com`
   *(All passwords are `password123`)*

### 2. Running the Application locally
1. **Start the Backend server:**
   ```bash
   cd backend
   node server.js
   ```
   *(Runs on port 5000)*

2. **Start the Frontend Vite server:**
   ```bash
   cd frontend
   npm run dev
   ```
   *(Runs on port 5173)*

### 3. Deployment
- **Frontend (Vercel):** Connect your GitHub repository to Vercel. Set the output directory to `frontend/dist` and the root directory to `frontend`.
- **Backend (Render/Railway):** Connect your GitHub repository to Render as a Web Service. Set the root directory to `backend`, build command to `npm install`, and start command to `node server.js`. Enure environment variables (`MONGO_URI`, `JWT_SECRET`) are configured in the Render dashboard.
- **Database:** MongoDB Atlas is already cloud-native.
