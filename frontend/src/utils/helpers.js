import { format, formatDistanceToNow } from 'date-fns'

export const CATEGORIES = ['Geopolitics', 'Defence', 'Tech Warfare']

export const CATEGORY_SLUG = {
  Geopolitics: 'geopolitics',
  Defence: 'defence',
  'Tech Warfare': 'tech-warfare',
}

export const CATEGORY_CLASS = {
  Geopolitics: 'badge-geopolitics',
  Defence: 'badge-defence',
  'Tech Warfare': 'badge-tech-warfare',
}

export function formatDate(dateStr) {
  try {
    return format(new Date(dateStr), 'dd MMM yyyy')
  } catch {
    return ''
  }
}

export function timeAgo(dateStr) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return ''
  }
}

export function truncate(str, len = 140) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len).trimEnd() + '…' : str
}

export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
