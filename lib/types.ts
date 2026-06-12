export type Platform = 'instagram' | 'threads' | 'bluesky' | 'mastodon' | 'reddit'

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
  captured_at: string
}

export interface TrackedAccountWithSnapshots extends TrackedAccount {
  metric_snapshots: MetricSnapshot[]
}

export const PLATFORMS: Record<Platform, { label: string; icon: string; color: string; bg: string }> = {
  instagram: { label: 'Instagram',  icon: '📸', color: '#E84873', bg: 'bg-pink-500/10'    },
  threads:   { label: 'Threads',    icon: '🧵', color: '#000000', bg: 'bg-gray-500/10'    },
  bluesky:   { label: 'Bluesky',   icon: '🦋', color: '#0086FF', bg: 'bg-blue-500/10'    },
  mastodon:  { label: 'Mastodon',  icon: '🐘', color: '#5C6FF2', bg: 'bg-indigo-500/10'  },
  reddit:    { label: 'Reddit',    icon: '🤖', color: '#FF4500', bg: 'bg-orange-500/10'  },
}
