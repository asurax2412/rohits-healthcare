# Rohit's Healthcare Website

A professional healthcare website with prescription management system.

## Features

- 🏥 Professional landing page
- 📝 Prescription writing system
- 👥 Patient management
- 🔐 Doctor authentication
- 📊 Dashboard with analytics

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install all dependencies
npm run install:all

# Or manually:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Environment Setup

Create `.env` file in the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rohit-healthcare
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (choose one)
# Option 1: Fast2SMS (India - free tier available)
FAST2SMS_API_KEY=your-fast2sms-api-key

# Option 2: Twilio (International)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Doctor Contact (for patient notifications)
DOCTOR_PHONE=+91-11-43033333
DOCTOR_EMAIL=doctor@healthcare.com
```

### Setting up Email (Gmail)
1. Go to Google Account > Security > 2-Step Verification (enable it)
2. Go to App Passwords > Create a new app password
3. Use that password in EMAIL_PASS

### Setting up SMS (Fast2SMS - India)
1. Register at https://www.fast2sms.com/
2. Get your API key from dashboard
3. Add to FAST2SMS_API_KEY

### Running the App

```bash
# Run both frontend and backend
npm run dev

# Or separately:
npm run dev:backend  # Backend on port 5000
npm run dev:frontend # Frontend on port 5173
```

## Project Structure

```
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app
│   └── index.html
└── package.json
```

## License

MIT

