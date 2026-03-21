const axios = require('axios')
const crypto = require('crypto')
const Post = require('../models/Post')

// Map NewsAPI topic → our category
const TOPIC_CATEGORY_MAP = [
  { keywords: ['defence', 'defense', 'military', 'navy', 'air force', 'army', 'weapon', 'missile', 'nato', 'nuclear'], category: 'Defence' },
  { keywords: ['cyber', 'hacking', 'malware', 'ransomware', 'surveillance', 'drone warfare', 'electronic warfare', 'ai weapon', 'space weapon'], category: 'Tech Warfare' },
  { keywords: ['geopolitics', 'diplomacy', 'sanction', 'war', 'conflict', 'treaty', 'election', 'territorial', 'alliance', 'tension'], category: 'Geopolitics' },
]

// Map tags from content
const TAG_PATTERNS = [
  { pattern: /russia|ukraine|kremlin/i, tag: 'Russia' },
  { pattern: /china|beijing|taiwan|pla/i, tag: 'China' },
  { pattern: /nato|alliance/i, tag: 'NATO' },
  { pattern: /iran|tehran/i, tag: 'Iran' },
  { pattern: /israel|gaza|hamas/i, tag: 'Middle East' },
  { pattern: /usa|america|pentagon|washington/i, tag: 'USA' },
  { pattern: /cyber|hack|malware/i, tag: 'Cyber' },
  { pattern: /nuclear/i, tag: 'Nuclear' },
  { pattern: /drone/i, tag: 'Drones' },
]

function categorizeArticle(text) {
  const lower = text.toLowerCase()
  for (const { keywords, category } of TOPIC_CATEGORY_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return category
  }
  return 'Geopolitics' // default fallback
}

function extractTags(text) {
  const tags = new Set()
  for (const { pattern, tag } of TAG_PATTERNS) {
    if (pattern.test(text)) tags.add(tag)
  }
  return [...tags].slice(0, 5)
}

function makeTitleHash(title) {
  return crypto.createHash('md5').update(title.toLowerCase().trim()).digest('hex')
}

// Generate AI summary using OpenAI (optional)
async function generateAISummary(title, content) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'your_openai_key_here') return ''

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a strategic intelligence analyst. Summarize the following news article in 2-3 concise sentences, focusing on strategic implications. Use formal, precise language.',
          },
          {
            role: 'user',
            content: `Title: ${title}\n\n${content}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    )
    return response.data.choices[0]?.message?.content?.trim() || ''
  } catch (err) {
    console.warn('AI summary failed:', err.message)
    return ''
  }
}

// POST /api/news/fetch
async function fetchNews(req, res) {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey || apiKey === 'your_newsapi_key_here') {
    return res.status(400).json({
      message: 'NEWS_API_KEY not configured. Add it to your backend .env file.',
    })
  }

  const queries = [
    'geopolitics world war conflict',
    'military defence weapons NATO',
    'cyber warfare hacking espionage',
  ]

  let fetched = 0
  let saved = 0
  let skipped = 0
  const errors = []

  try {
    for (const q of queries) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`

      let articles = []
      try {
        const resp = await axios.get(url, { timeout: 8000 })
        articles = resp.data.articles || []
      } catch (err) {
        errors.push(`Query "${q}" failed: ${err.message}`)
        continue
      }

      for (const article of articles) {
        if (!article.title || !article.description) continue

        fetched++
        const titleHash = makeTitleHash(article.title)

        // Check for duplicate
        const exists = await Post.findOne({ titleHash })
        if (exists) {
          skipped++
          continue
        }

        const fullText = `${article.title} ${article.description} ${article.content || ''}`
        const category = categorizeArticle(fullText)
        const tags = extractTags(fullText)

        // Build content HTML
        const content = `
          <p>${article.description}</p>
          ${article.content ? `<p>${article.content.replace(/\[\+\d+ chars\]/, '').trim()}</p>` : ''}
          ${article.author ? `<p><em>Source author: ${article.author}</em></p>` : ''}
        `.trim()

        // Optional AI summary
        const aiSummary = await generateAISummary(article.title, article.description)

        try {
          await Post.create({
            title: article.title,
            category,
            content,
            tags,
            aiSummary,
            isAutoFetched: true,
            sourceUrl: article.url || '',
            titleHash,
          })
          saved++
        } catch (saveErr) {
          if (saveErr.code === 11000) {
            skipped++ // Duplicate key — race condition
          } else {
            errors.push(`Save error: ${saveErr.message}`)
          }
        }
      }
    }

    res.json({
      message: 'Fetch complete',
      fetched,
      saved,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('fetchNews error:', err)
    res.status(500).json({ message: 'News fetch failed: ' + err.message })
  }
}

module.exports = { fetchNews }
