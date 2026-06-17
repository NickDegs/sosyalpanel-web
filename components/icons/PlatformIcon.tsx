import {
  siInstagram, siFacebook, siTiktok, siX, siYoutube,
  siThreads, siBluesky, siMastodon, siReddit,
} from 'simple-icons'
import type { Platform } from '@/lib/types'

const ICONS: Record<Platform, { path: string }> = {
  instagram: siInstagram,
  facebook:  siFacebook,
  tiktok:    siTiktok,
  twitter:   siX,
  youtube:   siYoutube,
  threads:   siThreads,
  bluesky:   siBluesky,
  mastodon:  siMastodon,
  reddit:    siReddit,
}

export function PlatformIcon({
  platform,
  size = 20,
  className,
  title,
}: {
  platform: Platform
  size?: number
  className?: string
  title?: string
}) {
  const icon = ICONS[platform]
  if (!icon) return null
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}
