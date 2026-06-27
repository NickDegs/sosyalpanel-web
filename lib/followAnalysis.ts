// Resmi veri içe aktarma — Instagram/TikTok "Verilerini İndir" dosyalarını
// TARAYICIDA işler. Sunucuya gönderilmez, kazıma/şifre yok. Kullanıcının kendi
// resmi verisi olduğu için yasal. Takipçi listesi public API'de gelmediğinden
// "geri takip etmeyen" analizi IG/TikTok için bu yolla yapılır.

import type { Platform } from './types'

export interface FollowUser {
  id: string
  handle: string
  displayName: string
  profileUrl: string | null
}

export interface FollowAnalysis {
  notFollowingBack: FollowUser[]   // takip ettiğin ama seni geri takip etmeyenler
  youDontFollowBack: FollowUser[]  // seni takip eden ama senin etmediklerin
  mutualCount: number
  followerCount: number
  followingCount: number
}

// Instagram: iki ayrı dosya metni (followers_1.json + following.json).
export function analyzeInstagram(followersText: string, followingText: string): FollowAnalysis | null {
  const fr = parseList(followersText, 'instagram')
  const fo = parseList(followingText, 'instagram')
  if (fr.length === 0 && fo.length === 0) return null
  return build(fr, fo)
}

// Genel (herhangi platform export'u, iki dosya).
export function analyzeGeneric(followersText: string, followingText: string, platform: Platform): FollowAnalysis | null {
  const fr = parseList(followersText, platform)
  const fo = parseList(followingText, platform)
  if (fr.length === 0 && fo.length === 0) return null
  return build(fr, fo)
}

// TikTok: tek birleşik dosya (user_data.json).
export function analyzeTikTok(text: string): FollowAnalysis | null {
  let root: unknown
  try { root = JSON.parse(text) } catch { return null }
  const followers: FollowUser[] = []
  const following: FollowUser[] = []
  splitFollow(root, 'none', followers, following)
  if (followers.length === 0 && following.length === 0) return null
  return build(dedupe(followers), dedupe(following))
}

// ---- iç işleyiş ----

function build(followers: FollowUser[], following: FollowUser[]): FollowAnalysis {
  const fr = dedupe(followers)
  const fo = dedupe(following)
  const frIds = new Set(fr.map(u => u.id.toLowerCase()))
  const foIds = new Set(fo.map(u => u.id.toLowerCase()))
  return {
    notFollowingBack: fo.filter(u => !frIds.has(u.id.toLowerCase())),
    youDontFollowBack: fr.filter(u => !foIds.has(u.id.toLowerCase())),
    mutualCount: [...frIds].filter(id => foIds.has(id)).length,
    followerCount: fr.length,
    followingCount: fo.length,
  }
}

function dedupe(users: FollowUser[]): FollowUser[] {
  const seen = new Set<string>()
  const out: FollowUser[] = []
  for (const u of users) {
    if (!u.id) continue
    const key = u.id.toLowerCase()
    if (!seen.has(key)) { seen.add(key); out.push(u) }
  }
  return out
}

function parseList(text: string, platform: Platform): FollowUser[] {
  let root: unknown
  try { root = JSON.parse(text) } catch { return parseHtml(text, platform) }
  const out: FollowUser[] = []
  collectJson(root, platform, out)
  if (out.length > 0) return dedupe(out)
  return parseHtml(text, platform)
}

function collectJson(any: unknown, platform: Platform, out: FollowUser[]): void {
  if (Array.isArray(any)) {
    for (const e of any) collectJson(e, platform, out)
  } else if (any && typeof any === 'object') {
    const obj = any as Record<string, unknown>
    const sld = obj['string_list_data']
    if (Array.isArray(sld) && sld.length > 0) {
      const first = sld[0] as Record<string, unknown>
      const v = typeof first['value'] === 'string' ? (first['value'] as string) : ''
      if (v) { out.push(makeUser(v, first['href'] as string | undefined, platform)); return }
    }
    const uname = userName(obj)
    if (uname) { out.push(makeUser(uname, obj['href'] as string | undefined, platform)); return }
    for (const v of Object.values(obj)) collectJson(v, platform, out)
  }
}

type Ctx = 'none' | 'followers' | 'following'

function splitFollow(any: unknown, ctx: Ctx, followers: FollowUser[], following: FollowUser[]): void {
  if (Array.isArray(any)) {
    for (const e of any) splitFollow(e, ctx, followers, following)
  } else if (any && typeof any === 'object') {
    const obj = any as Record<string, unknown>
    const uname = userName(obj)
    if (uname && ctx !== 'none') {
      const fu = makeUser(uname, obj['Link'] as string | undefined, 'tiktok')
      if (ctx === 'followers') followers.push(fu); else following.push(fu)
      return
    }
    for (const [k, v] of Object.entries(obj)) {
      const kl = k.toLowerCase()
      let next: Ctx = ctx
      if (kl.includes('fans') || (kl.includes('follower') && !kl.includes('following'))) next = 'followers'
      else if (kl.includes('following')) next = 'following'
      splitFollow(v, next, followers, following)
    }
  }
}

function userName(o: Record<string, unknown>): string | null {
  for (const key of ['UserName', 'Username', 'userName', 'username', 'user_name']) {
    const v = o[key]
    if (typeof v === 'string' && v.trim()) return v
  }
  return null
}

function makeUser(raw: string, href: string | undefined, platform: Platform): FollowUser {
  const name = raw.trim().replace(/^@/, '')
  const profile = (href && href.trim()) ? href : defaultProfile(name, platform)
  return { id: name, handle: `@${name}`, displayName: name, profileUrl: profile }
}

function defaultProfile(user: string, platform: Platform): string | null {
  switch (platform) {
    case 'instagram': return `https://www.instagram.com/${user}`
    case 'tiktok': return `https://www.tiktok.com/@${user}`
    case 'twitter': return `https://x.com/${user}`
    default: return null
  }
}

function parseHtml(html: string, platform: Platform): FollowUser[] {
  const re = platform === 'instagram'
    ? /instagram\.com\/([A-Za-z0-9._]+)/g
    : platform === 'tiktok'
      ? /tiktok\.com\/@([A-Za-z0-9._]+)/g
      : /(?:instagram|tiktok)\.com\/@?([A-Za-z0-9._]+)/g
  const skip = new Set(['p', 'explore', 'reels', 'stories', 'accounts', 'direct', 'tv'])
  const out: FollowUser[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const u = m[1]
    if (u && !skip.has(u.toLowerCase())) out.push(makeUser(u, undefined, platform))
  }
  return dedupe(out)
}
