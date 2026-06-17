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

// Kurumsal tasarım: emoji yerine PlatformIcon (gerçek marka SVG'leri) kullanılır.
// color = markanın resmi rengi; bg = nötr kapsayıcı arka planı.
export const PLATFORMS: Record<Platform, { label: string; color: string; bg: string }> = {
  instagram: { label: 'Instagram',   color: '#E1306C', bg: 'bg-pink-500/10'   },
  facebook:  { label: 'Facebook',    color: '#1877F2', bg: 'bg-blue-600/10'   },
  tiktok:    { label: 'TikTok',      color: '#FFFFFF', bg: 'bg-white/10'      },
  twitter:   { label: 'X',           color: '#FFFFFF', bg: 'bg-white/10'      },
  youtube:   { label: 'YouTube',     color: '#FF0000', bg: 'bg-red-500/10'    },
  threads:   { label: 'Threads',     color: '#FFFFFF', bg: 'bg-white/10'      },
  bluesky:   { label: 'Bluesky',     color: '#0085FF', bg: 'bg-blue-500/10'   },
  mastodon:  { label: 'Mastodon',    color: '#6364FF', bg: 'bg-indigo-500/10' },
  reddit:    { label: 'Reddit',      color: '#FF4500', bg: 'bg-orange-500/10' },
}
