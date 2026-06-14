export type Platform =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'twitter'
  | 'youtube'
  | 'threads'
  | 'bluesky'
  | 'mastodon'
  | 'reddit'

export interface TrackedAccount {
  id: string
  user_id: string
  platform: Platform
  username: string
  sort_order: number
  added_at: string
}

export interface MetricSnapshot {
  id: string
  account_id: string
  followers: number
  following: number | null
  posts: number | null
  captured_at: string
}

export interface TrackedAccountWithSnapshots extends TrackedAccount {
  metric_snapshots: MetricSnapshot[]
}

export const PLATFORMS: Record<Platform, { label: string; icon: string; color: string; bg: string }> = {
  instagram: { label: 'Instagram',   icon: '📸', color: '#E84873', bg: 'bg-pink-500/15'   },
  facebook:  { label: 'Facebook',    icon: '💙', color: '#1877F2', bg: 'bg-blue-600/15'   },
  tiktok:    { label: 'TikTok',      icon: '🎵', color: '#FF0050', bg: 'bg-rose-600/15'   },
  twitter:   { label: 'X (Twitter)', icon: '✦',  color: '#E7E9EA', bg: 'bg-gray-400/10'   },
  youtube:   { label: 'YouTube',     icon: '▶',  color: '#FF0000', bg: 'bg-red-500/15'    },
  threads:   { label: 'Threads',     icon: '◎',  color: '#A8A8A8', bg: 'bg-gray-500/10'   },
  bluesky:   { label: 'Bluesky',    icon: '🦋', color: '#0085FF', bg: 'bg-blue-500/15'   },
  mastodon:  { label: 'Mastodon',   icon: '🐘', color: '#5C6FF2', bg: 'bg-indigo-500/15' },
  reddit:    { label: 'Reddit',      icon: '🔴', color: '#FF4500', bg: 'bg-orange-500/15' },
}
