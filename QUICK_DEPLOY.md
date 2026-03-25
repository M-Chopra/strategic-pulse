# Strategic Pulse - Quick Deployment Steps

All code is now on GitHub! Follow these exact steps to deploy to Render and Vercel.

## ✅ Code Pushed to GitHub
**Repository:** https://github.com/M-Chopra/strategic-pulse.git  
**Branch:** main  
**Latest Commit:** Complete implementation with deployment configs

---

## 🚀 STEP 1: Deploy Backend to Render (5 minutes)

1. **Go to Render Dashboard:** https://dashboard.render.com/

2. **Create New Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Click "Build and deploy from a Git repository"

3. **Connect GitHub:**
   - Connect your GitHub account (if not already connected)
   - Select repository: `strategic-pulse`
   - Branch: `main`

4. **Configure Deployment:**
   - **Name:** `strategic-pulse-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (or Starter for better performance)

5. **Add Environment Variables** (click "Advanced"):
   ```
   MONGO_URI = your_mongodb_atlas_connection_string
   JWT_SECRET = generate_random_string (use: openssl rand -base64 32)
   JWT_REFRESH_SECRET = generate_random_string (use: openssl rand -base64 32)
   ADMIN_USERNAME = admin
   ADMIN_PASSWORD = your_secure_password
   NEWS_API_KEY = your_newsapi_key (from newsapi.org)
   OPENAI_API_KEY = optional (from openai.com)
   NODE_ENV = production
   ```

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Copy the URL: `https://YOUR_NAME-backend.onrender.com`

7. **Verify:**
   - Visit: `https://YOUR_NAME-backend.onrender.com/api/health`
   - Should return JSON with status "operational"

---

## 🌐 STEP 2: Deploy Frontend to Vercel (5 minutes)

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard

2. **Create New Project:**
   - Click "New Project"
   - Select your GitHub account
   - Search for `strategic-pulse` repository
   - Click "Import"

3. **Configure Project:**
   - **Project Name:** `strategic-pulse-frontend` (or your choice)
   - **Framework:** `Vite`
   - **Root Directory:** `frontend`

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL = https://YOUR_RENDER_URL/api
     ```
     (Replace `YOUR_RENDER_URL` with the Render backend URL from Step 1)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Copy your Vercel URL: `https://strategic-pulse-Frontend.vercel.app`

6. **Verify:**
   - Visit your Vercel URL
   - Homepage should load with green status indicator
   - Try signing up → should work

---

## 📋 Post-Deployment Verification Checklist

**Backend Tests:**
- [ ] Health endpoint returns `operational` status
- [ ] Can signup via API: `POST /api/auth/signup`
- [ ] Can login via API: `POST /api/auth/login`
- [ ] Can fetch posts: `GET /api/posts`

**Frontend Tests:**
- [ ] Homepage loads without errors
- [ ] Can sign up (creates new user)
- [ ] Can login (with email/password)
- [ ] Can search posts with filters
- [ ] Can view profile page
- [ ] Can bookmark posts
- [ ] Can comment on posts

---

## 🔗 Key Links

| Service | URL |
|---------|-----|
| **GitHub** | https://github.com/M-Chopra/strategic-pulse |
| **Render Backend** | https://YOUR_NAME-backend.onrender.com |
| **Vercel Frontend** | https://strategic-pulse-Frontend.vercel.app |
| **MongoDB Atlas** | https://account.mongodb.com/account/login |
| **NewsAPI** | https://newsapi.org |

---

## 🔧 Troubleshooting

### Render Backend Issues

**Build fails:**
- Check "Logs" tab in Render
- Verify all environment variables are set
- Ensure `package.json` dependencies are correct

**Database connection fails:**
- Verify `MONGO_URI` is correct
- Go to MongoDB Atlas → Network Access
- Add Render IP to whitelist (or allow `0.0.0.0/0` for testing)

### Vercel Frontend Issues

**API calls fail / CORS error:**
- Check `VITE_API_URL` environment variable in Vercel
- Ensure backend URL includes `/api`
- Test in browser console: check Network tab

**Build fails:**
- Check Vercel build logs
- Verify `.env.production` exists
- Ensure all imports are correct

### Both Failing

**Check Git commits:**
```bash
cd strategic-pulse
git log -3  # Verify your latest commits
```

**Rebuild manually:**
- Render: Go to Dashboard → Your Service → Click "Pull Recent"
- Vercel: Go to Dashboard → Your Project → Redeploy → "Redeploy"

---

## 📚 What's Deployed

### Backend (Render)
- ✅ User authentication (signup/login/refresh)
- ✅ Comments system with threading and moderation
- ✅ Bookmarks feature
- ✅ Advanced search with filters and sorting
- ✅ Admin moderation panel
- ✅ All API endpoints documented in `DEPLOYMENT.md`

### Frontend (Vercel)
- ✅ Responsive UI (desktop/mobile/tablet)
- ✅ User signup and login pages
- ✅ User profile management
- ✅ Search with date filters and sorting
- ✅ Comments section with replies
- ✅ Bookmark/save posts feature
- ✅ Admin dashboard

---

## 🎯 Next Steps (Optional)

1. **Custom Domain:**
   - Vercel: Add domain in project settings
   - Render: Use custom domain in environment

2. **Performance Optimization:**
   - Enable caching on Vercel
   - Optimize Render plan for production traffic

3. **Monitoring & Analytics:**
   - Set up error tracking (e.g., Sentry)
   - Monitor API usage and performance

4. **Future Features:**
   - User notifications
   - Email verification
   - Social media sharing
   - Advanced analytics

---

## 💡 Pro Tips

- **Render free tier:** Spins down after 15 mins of inactivity. Upgrade to avoid this.
- **Vercel:** Always free for hobby projects, excellent performance.
- **Keep secrets safe:** Never commit `.env` files. Use platform's environment variables.
- **Monitor logs:** Regularly check Render/Vercel logs for issues.
- **Database backups:** Enable MongoDB Atlas backups for production.

---

## ✨ Success!

Once deployed and verified, you have a fully functional Strategic Pulse platform ready for users!

**Questions?** Check `DEPLOYMENT.md` for detailed troubleshooting.

