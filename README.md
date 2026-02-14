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

## Default Credentials

### Doctor Login (Pre-seeded)

| Field | Value |
|-------|-------|
| Email | `rohitkr.singh200088@gmail.com` |
| Password | `Rohit@123` |

### MongoDB Atlas

| Field | Value |
|-------|-------|
| Cluster | `healthcare.iykwl3h.mongodb.net` |
| DB User | `kumaryashhbss_db_user` |
| DB Password | `kumaryashhbss_db_user` |
| Connection String | `mongodb+srv://kumaryashhbss_db_user:kumaryashhbss_db_user@healthcare.iykwl3h.mongodb.net/rohit-healthcare?retryWrites=true&w=majority` |
| Database Name | `rohit-healthcare` |

### Render (Backend) Environment Variables

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | *(Atlas connection string above)* |
| `JWT_SECRET` | *(generate a strong 32+ char random string)* |
| `FRONTEND_URL` | *(your Vercel URL, e.g. https://rohit-healthcare.vercel.app)* |
| `EMAIL_USER` | `asurax2412@gmail.com` |
| `EMAIL_PASS` | `webpgtghgznthyye` |
| `FAST2SMS_API_KEY` | `51JdE4nPtYkMv0pWSBIHol6w8iRqyVZjOcNh2fea7mTxUKDb3uNXDt4jFufgbG8s5IHOziCw2RaZmEov` |

### Vercel (Frontend) Environment Variables

| Key | Value |
|-----|-------|
| `VITE_API_URL` | *(your Render backend URL + /api, e.g. https://rohit-healthcare-api.onrender.com/api)* |

### Deployment Links

| Service | URL |
|---------|-----|
| MongoDB Atlas | [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) |
| Render Dashboard | [render.com](https://render.com) |
| Vercel Dashboard | [vercel.com](https://vercel.com) |
| GitHub Repo | [github.com/asurax2412/rohits-healthcare](https://github.com/asurax2412/rohits-healthcare) |

> **Note:** After deploying, update the URLs in this table with your actual production URLs.

## License

MIT

