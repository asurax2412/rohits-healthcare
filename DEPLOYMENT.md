# 🚀 Free Deployment Guide

Deploy your healthcare website for **FREE** using these services:

| Component | Service | Free Tier |
|-----------|---------|-----------|
| Frontend | Vercel | Unlimited |
| Backend | Render | 750 hrs/month |
| Database | MongoDB Atlas | 512MB |

---

## Step 1: MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Login
3. Create a **FREE Cluster** (M0 Sandbox - Shared)
4. Set up Database User:
   - Go to **Database Access** → **Add New Database User**
   - Create username & password (save these!)
5. Set up Network Access:
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Get Connection String:
   - Go to **Databases** → **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password

Example:
```
mongodb+srv://rohit:MyPassword123@cluster0.abc123.mongodb.net/rohit-healthcare?retryWrites=true&w=majority
```

---

## Step 2: Deploy Backend on Render (Free)

1. Push your code to **GitHub**:
   ```bash
   cd D:\MyProject\RohitsPage
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/rohits-healthcare.git
   git push -u origin main
   ```

2. Go to [Render.com](https://render.com) and sign up with GitHub

3. Click **"New +"** → **"Web Service"**

4. Connect your GitHub repo and select `backend` folder:
   - **Name**: rohit-healthcare-api
   - **Region**: Singapore (closest to India)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add **Environment Variables** (click "Advanced"):
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = mongodb+srv://rohit:password@cluster0.xxx.mongodb.net/rohit-healthcare
   JWT_SECRET = your-secret-key-here-make-it-long-and-random
   FRONTEND_URL = https://rohit-healthcare.vercel.app
   EMAIL_USER = asurax2412@gmail.com
   EMAIL_PASS = webpgtghgznthyye
   FAST2SMS_API_KEY = 51JdE4nPtYkMv0pWSBIHol6w8iRqyVZjOcNh2fea7mTxUKDb3uNXDt4jFufgbG8s5IHOziCw2RaZmEov
   ```

6. Click **"Create Web Service"**

7. Wait for deployment (5-10 minutes)

8. Note your backend URL: `https://rohit-healthcare-api.onrender.com`

---

## Step 3: Deploy Frontend on Vercel (Free)

1. Go to [Vercel.com](https://vercel.com) and sign up with GitHub

2. Click **"Add New..."** → **"Project"**

3. Import your GitHub repo

4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add **Environment Variables**:
   ```
   VITE_API_URL = https://rohit-healthcare-api.onrender.com/api
   ```

6. Click **"Deploy"**

7. Your frontend will be live at: `https://rohit-healthcare.vercel.app`

---

## Step 4: Update Backend CORS

After getting your Vercel URL, update the `FRONTEND_URL` on Render:

1. Go to Render Dashboard → Your Service → Environment
2. Update `FRONTEND_URL` to your actual Vercel URL
3. Click "Save Changes" (auto-redeploys)

---

## 🔒 Production Security Checklist

- [ ] Remove OTP from API responses (currently shown for testing)
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable license verification (remove dev mode bypass)
- [ ] Set up proper email domain (not Gmail for production)
- [ ] Enable rate limiting

---

## 📱 Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project → Settings → Domains
2. Add your domain (e.g., `drohithealthcare.com`)
3. Update DNS at your registrar

### For Render (Backend):
1. Go to Service → Settings → Custom Domains
2. Add subdomain (e.g., `api.drohithealthcare.com`)

---

## 🆓 Alternative Free Options

### Backend Alternatives:
- **Railway.app** - $5 free credit/month
- **Fly.io** - Free tier available
- **Cyclic.sh** - Generous free tier

### Frontend Alternatives:
- **Netlify** - Similar to Vercel
- **Cloudflare Pages** - Unlimited, very fast

### Database Alternatives:
- **Supabase** - PostgreSQL, 500MB free
- **PlanetScale** - MySQL, 5GB free

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB?
- Check if IP whitelist includes 0.0.0.0/0
- Verify connection string password

### CORS errors?
- Ensure FRONTEND_URL is set correctly on Render
- Include `https://` in the URL

### Render service sleeping?
- Free tier sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading for production use

---

## 📞 Support

If you face issues, check:
1. Render Logs: Dashboard → Your Service → Logs
2. Vercel Logs: Dashboard → Your Project → Deployments → Logs
3. Browser Console: F12 → Console tab

