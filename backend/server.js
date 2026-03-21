require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cron = require('node-cron')
const rateLimit = require('express-rate-limit')

const postRoutes = require('./routes/posts')
const authRoutes = require('./routes/auth')
const newsRoutes = require('./routes/news')
const { fetchNews } = require('./controllers/newsController')

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ──────────────────────────────────────────────

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}))

app.use(express.json({ limit: '2mb' }))

// Rate limiting — protect against abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ── Routes ──────────────────────────────────────────────────

app.use('/api/posts', postRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

// ── Database Connection ─────────────────────────────────────

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✓ MongoDB connected')
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

// ── Auto-fetch Cron Job ─────────────────────────────────────
// Runs every 6 hours automatically
// Requires NEWS_API_KEY in .env

function startCronJob() {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey || apiKey === 'your_newsapi_key_here') {
    console.log('ℹ  NEWS_API_KEY not set — auto-fetch cron disabled')
    return
  }

  // Every 6 hours: '0 */6 * * *'
  // Every minute for testing: '* * * * *'
  cron.schedule('0 */6 * * *', async () => {
    console.log('[CRON] Auto-fetching news...')
    try {
      // Simulate a minimal req/res for the controller
      const fakeReq = {}
      const fakeRes = {
        json: (data) => console.log('[CRON] Fetch result:', data),
        status: () => ({ json: (d) => console.log('[CRON] Fetch error:', d) }),
      }
      await fetchNews(fakeReq, fakeRes)
    } catch (err) {
      console.error('[CRON] Auto-fetch failed:', err.message)
    }
  })

  console.log('✓ Auto-fetch cron job scheduled (every 6 hours)')
}

// ── Start Server ────────────────────────────────────────────

async function start() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`\n▲ STRATEGIC PULSE BACKEND`)
    console.log(`  Server   → http://localhost:${PORT}`)
    console.log(`  Health   → http://localhost:${PORT}/api/health`)
    console.log(`  Posts    → http://localhost:${PORT}/api/posts`)
    console.log('')
  })

  startCronJob()
}

start()
