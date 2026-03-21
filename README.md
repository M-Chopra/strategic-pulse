# ▲ Strategic Pulse

> Independent geopolitics and defence intelligence platform — built with React + Node.js + MongoDB.

---

## Project Structure

```
strategic-pulse/
├── frontend/          ← React + Vite app
│   └── src/
│       ├── components/   Navbar, PostCard, SearchBar, etc.
│       ├── pages/        Home, SinglePost, AdminDashboard, Login
│       ├── hooks/        usePosts, usePost
│       ├── context/      AuthContext (JWT)
│       └── utils/        api.js, helpers.js
│
└── backend/           ← Node.js + Express + MongoDB
    ├── models/        Post.js (Mongoose schema)
    ├── controllers/   postController.js, newsController.js
    ├── routes/        posts.js, auth.js, news.js
    ├── middleware/    auth.js (JWT)
    └── server.js      Entry point + cron job
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

## Quick Start

### 1. Start MongoDB

**Local:**
```bash
mongod
```
**Or use MongoDB Atlas** — paste your connection string into backend `.env`.

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```env
MONGO_URI=mongodb://localhost:27017/strategic-pulse
JWT_SECRET=change_this_to_a_random_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEWS_API_KEY=your_key_from_newsapi.org   # Free at https://newsapi.org
OPENAI_API_KEY=your_openai_key           # Optional — for AI summaries
PORT=5000
```

```bash
npm run dev
```

Backend runs on **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## Admin Login

Navigate to **http://localhost:5173/admin/login**

Default credentials (set in `.env`):
- Username: `admin`
- Password: `admin123`

---

## API Reference

| Method | Endpoint          | Auth | Description               |
|--------|-------------------|------|---------------------------|
| GET    | /api/posts        | No   | List posts (with filters) |
| GET    | /api/posts/:id    | No   | Single post               |
| POST   | /api/posts        | Yes  | Create post               |
| DELETE | /api/posts/:id    | Yes  | Delete post               |
| POST   | /api/auth/login   | No   | Admin login → JWT token   |
| POST   | /api/news/fetch   | Yes  | Trigger news auto-fetch   |
| GET    | /api/health       | No   | Health check              |

**Query params for GET /api/posts:**
- `?category=Geopolitics|Defence|Tech Warfare`
- `?search=ukraine`
- `?page=1&limit=9`

---

## Features

- **Blog listing** with categories, search, pagination
- **Admin dashboard** — create, view, delete posts
- **JWT authentication** — protected admin routes
- **Auto-fetch** — pulls from NewsAPI on demand or every 6 hours via cron
- **Deduplication** — MD5 hash on title prevents duplicate articles
- **AI summaries** — OpenAI GPT-3.5 generates strategic briefs (optional)
- **Tags & filtering** — auto-extracted from article content
- **Responsive design** — works on mobile and desktop

---

## Environment Variables

| Variable         | Required | Description                          |
|------------------|----------|--------------------------------------|
| MONGO_URI        | ✓        | MongoDB connection string            |
| JWT_SECRET       | ✓        | Secret for signing JWT tokens        |
| ADMIN_USERNAME   | ✓        | Admin login username                 |
| ADMIN_PASSWORD   | ✓        | Admin login password                 |
| NEWS_API_KEY     | Optional | NewsAPI.org key for auto-fetch       |
| OPENAI_API_KEY   | Optional | OpenAI key for AI summaries          |
| PORT             | Optional | Backend port (default: 5000)         |

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router v6   |
| Backend   | Node.js, Express 4                |
| Database  | MongoDB, Mongoose 8               |
| Auth      | JWT (jsonwebtoken), bcryptjs      |
| News Feed | NewsAPI.org                       |
| AI        | OpenAI GPT-3.5 (optional)         |
| Scheduler | node-cron                         |
