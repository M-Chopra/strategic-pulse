# Strategic Pulse - Deployment Guide

This guide walks you through deploying Strategic Pulse to Render (backend) and Vercel (frontend).

## Prerequisites

- GitHub repository with the codebase
- Render.com account
- Vercel.com account
- MongoDB Atlas account (for production database)

---

## Backend Deployment (Render)

### 1. Prepare Backend Environment

The `backend/render.yaml` file is already configured. You need to set environment variables in Render:

**Steps:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New Web Service"
3. Connect your GitHub repository
4. Select the `backend` directory as root
5. Fill in the following environment variables:

```
MONGO_URI: your_mongodb_atlas_connection_string
JWT_SECRET: generate_a_random_string_here
JWT_REFRESH_SECRET: generate_a_random_string_here
ADMIN_USERNAME: admin
ADMIN_PASSWORD: your_secure_password
NEWS_API_KEY: your_newsapi_key
OPENAI_API_KEY: optional
NODE_ENV: production
PORT: 5000
```

**Build Command:** `npm install`
**Start Command:** `npm start`
**Plan:** Free or Starter (Free plan will be slower)

### 2. Deploy

- Click "Create Web Service"
- Render will automatically deploy on git push
- Copy your Render service URL (e.g., `https://strategic-pulse-backend.onrender.com`)

### 3. Test Backend

```bash
curl https://YOUR_RENDER_URL/api/health
```

Expected response:
```json
{
  "status": "operational",
  "timestamp": "2026-03-24T...",
  "db": "connected"
}
```

---

## Frontend Deployment (Vercel)

### 1. Prepare Frontend Environment

Update `frontend/.env.production`:

```
VITE_API_URL=https://YOUR_RENDER_BACKEND_URL/api
```

### 2. Deploy to Vercel

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select `frontend` as root directory
5. Add environment variable:

```
VITE_API_URL: https://YOUR_RENDER_BACKEND_URL/api
```

6. Click "Deploy"

Vercel will automatically deploy on git push.

### 3. Verify Deployment

Visit your Vercel URL and test:
- Homepage loads
- Search works
- Categories filter works
- Sign up / Login works

---

## Local Testing Before Deployment

### 1. Test Backend Locally

```bash
cd backend
npm install
npm start
```

Check: http://localhost:5000/api/health

### 2. Test Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

Test all features:
- Sign up
- Login
- Search + filters
- Comments
- Bookmarks

---

## Database Setup

Make sure your MongoDB Atlas database is configured:

1. Go to MongoDB Atlas
2. Create a cluster
3. Add connection string to `MONGO_URI` environment variable
4. Whitelist Render IP:
   - In Atlas, go to Network Access
   - Add IP address `0.0.0.0/0` (for development) or specific Render IP

---

## Post-Deployment Checklist

- [ ] Backend health endpoint working
- [ ] Frontend loads without errors
- [ ] User signup working
- [ ] User login working
- [ ] Comments posting working
- [ ] Search and filters working
- [ ] API calls from frontend to backend working
- [ ] Database operations working

---

## Troubleshooting

### Backend Issues

**CORS Error in Frontend:**
- Check backend `server.js` CORS configuration
- Add your Vercel URL to `allowedOrigins`

**Database Connection Error:**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network access allows Render IP

**Port Issues:**
- Render assigns port automatically via `PORT` env var
- Don't hardcode port in code

### Frontend Issues

**API calls fail:**
- Check `VITE_API_URL` environment variable
- Verify backend URL includes `/api`
- Check browser console for CORS errors

**Build fails:**
- Ensure `.env.production` exists
- Check all dependencies are in `package.json`
- Verify no hardcoded localhost URLs

---

## GitHub Repository Structure

```
strategic-pulse/
├── backend/
│   ├── .env (local - never commit)
│   ├── .env.production (template - update before deploy)
│   ├── render.yaml
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── .env (local - never commit)
│   ├── .env.production
│   ├── vercel.json
│   ├── vite.config.js
│   ├── package.json
│   ├── src/
│   └── index.html
└── .gitignore
```

---

## Continuous Deployment

Both Render and Vercel support automatic deployment on push:

1. Push to `main` branch (or your default branch)
2. Render automatically triggers backend build
3. Vercel automatically triggers frontend build
4. Once both pass, your site is live

---

## Environment Variables Summary

### Backend (Render)

| Variable | Example | Where to Get |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas |
| `JWT_SECRET` | `your_random_string` | Generate: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | `your_random_string` | Generate: `openssl rand -base64 32` |
| `ADMIN_USERNAME` | `admin` | Choose your own |
| `ADMIN_PASSWORD` | `secure_password` | Choose your own |
| `NEWS_API_KEY` | From newsapi.org | https://newsapi.org |
| `OPENAI_API_KEY` | From OpenAI | Optional, https://openai.com |
| `NODE_ENV` | `production` | Always use this for production |
| `PORT` | `5000` | Will be set by Render |

### Frontend (Vercel)

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

