# Setup Guide - Local & Production

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create `backend/.env` with the following content:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/note-taking-app
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start MongoDB:**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Use your connection string

5. **Build and start backend:**
   ```bash
   npm run build
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional for local):**
   Create `frontend/.env` with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Local Development URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

---

## 🌐 Production Deployment

### Backend (Render)

1. **Set Environment Variables in Render Dashboard:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secure-jwt-secret
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

2. **Deploy to Render:**
   - Connect your GitHub repository
   - Use the existing `render.yaml` configuration
   - Deploy

### Frontend (Vercel)

1. **Set Environment Variables in Vercel Dashboard:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository
   - Deploy

---

---

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` matches your actual frontend URL
   - Check that the frontend URL is in the allowed origins

2. **Database Connection:**
   - Verify MongoDB connection string
   - Check network access for MongoDB Atlas


4. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Restart services after changing environment variables

### Testing

1. **Health Check:**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```

2. **Test API Endpoints:**
   ```bash
   # Signup
   curl -X POST https://your-backend-url.onrender.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
   
   # Login
   curl -X POST https://your-backend-url.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

---

## 📝 Environment Variables Reference

### Backend Required Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Frontend Required Variables
- `VITE_API_URL` - Backend API URL

### Optional Variables
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window
