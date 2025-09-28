# Note Taking App

A full-stack note-taking application with Email/OTP + Google Authentication, built with React, TypeScript, Node.js, and MongoDB.

## 🚀 Features

- **Authentication**
  - Email + OTP signup & login
  - Google OAuth login (ready for implementation)
  - JWT-based session management
  - Secure passwordless authentication

- **Notes Management**
  - Create, read, and delete personal notes
  - Real-time note updates
  - Responsive design for all devices
  - Rich text content support

- **Security**
  - JWT token authentication
  - Rate limiting
  - Input validation
  - CORS protection
  - Helmet security headers

- **User Experience**
  - Modern, responsive UI with Tailwind CSS
  - Toast notifications
  - Loading states
  - Error handling
  - Mobile-friendly design

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for OTP emails
- **Joi** for validation
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

### Database
- **MongoDB Atlas** (cloud) or local MongoDB

### Deployment
- **Frontend**: Vercel/Netlify
- **Backend**: Render/Heroku/Railway
- **Database**: MongoDB Atlas

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB
- Email service (Gmail SMTP recommended)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd note-taking-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/note-taking-app?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

#### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Production Mode with Docker
```bash
# Create .env file in root directory with all environment variables
docker-compose up --build
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## 📁 Project Structure

```
note-taking-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── jwt.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── notes.controller.ts
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Note.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── notes.routes.ts
│   │   ├── utils/
│   │   │   └── otp.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Signup.tsx
│   │   │   │   └── Login.tsx
│   │   │   └── Notes/
│   │   │       ├── NoteForm.tsx
│   │   │       └── NotesList.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   └── Welcome.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user with email
- `POST /api/auth/verify-otp` - Verify OTP and complete registration
- `POST /api/auth/login` - Login with email and OTP
- `POST /api/auth/request-otp` - Request new OTP

### Notes (Protected)
- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get a specific note
- `DELETE /api/notes/:id` - Delete a note

## 🌍 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`
3. Deploy

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables from the backend `.env` file
3. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in your deployment environment

## 🔧 Environment Variables

### Backend
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `EMAIL_HOST` - SMTP host for sending emails
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password/app password
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `VITE_API_URL` - Backend API URL

## 🚀 Getting Started

1. **Sign Up**: Enter your name and email to receive an OTP
2. **Verify Email**: Enter the 6-digit OTP sent to your email
3. **Create Notes**: Start creating and managing your notes
4. **Secure**: All data is protected with JWT authentication

## 📱 Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All screen sizes

## 🔒 Security Features

- JWT token-based authentication
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- Passwordless authentication (OTP-based)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Review the environment variables
3. Ensure all dependencies are installed
4. Check the console for error messages

## 🎯 Future Enhancements

- Google OAuth integration
- Note sharing capabilities
- Rich text editor
- Note categories and tags
- Search functionality
- Export notes to PDF
- Dark mode theme
- Offline support
- Push notifications

---

**Happy Note Taking! 📝**
