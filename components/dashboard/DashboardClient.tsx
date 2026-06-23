'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getBrowserUserId } from '@/lib/auth'
import { TrackedAccountWithSnapshots, PLATFORMS, Platform } from '@/lib/types'
import { PlatformIcon } from '@/components/icons/PlatformIcon'
import { ChartGlyph, CloseIcon } from '@/components/icons/Glyphs'

export default function DashboardClient({ initialAccounts }: { initialAccounts: TrackedAccountWithSnapshots[] }) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [showAdd, setShowAdd] = useState(false)

  const totalFollowers = accounts.reduce((sum, a) => {
    const latest = a.metric_snapshots?.slice()
      .sort((x, y) => new Date(y.captured_at).getTime() - new Date(x.captured_at).getTime())[0]
    return sum + (latest?.followers ?? 0)
  }, 0)

  const weekAgo = Date.now() - 7 * 86400_000
  const weekGrowth = accounts.reduce((sum, a) => {
    const sorted = (a.metric_snapshots ?? []).slice()
      .sort((x, y) => new Date(x.captured_at).getTime() - new Date(y.captured_at).getTime())
    const latest = sorted.at(-1)
    const base = sorted.findLast(s => new Date(s.captured_at).getTime() <= weekAgo)
    if (latest && base) return sum + (latest.followers - base.followers)
    return sum
  }, 0)

  function onAdded(acc: TrackedAccountWithSnapshots) {
    setAccounts(prev => [...prev, acc])
    setShowAdd(false)
  }

  function onDeleted(id: string) {
    setAccounts(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[28px] font-bold text-white">Genel Bakış</h1>
          <p className="text-white/40 text-[13px] mt-0.5">{accounts.length} hesap takip ediliyor</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-[13px] text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}
        >
          <span className="text-lg leading-none">+</span> Hesap Ekle
        </button>
      </div>

      {/* Summary row */}
      {accounts.length > 0 && (
        <div className="glass rounded-2xl p-4 mb-5 flex items-center gap-6">
          <div>
            <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Toplam Erişim</p>
            <p className="text-white text-[24px] font-bold">{totalFollowers.toLocaleString('tr-TR')}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Bu Hafta</p>
            <p className={`text-[18px] font-bold ${weekGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {weekGrowth >= 0 ? '+' : ''}{weekGrowth.toLocaleString('tr-TR')}
            </p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Platform</p>
            <div className="flex gap-1 mt-1">
              {[...new Set(accounts.map(a => a.platform))].slice(0, 6).map(p => (
                <PlatformIcon key={p} platform={p as Platform} size={18} className="text-white/70" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cards grid */}
      {accounts.length === 0 ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(acc => (
            <AccountCard key={acc.id} account={acc} onDeleted={onDeleted} />
          ))}
        </div>
      )}

      {/* Add account sheet */}
      {showAdd && <AddAccountSheet onClose={() => setShowAdd(false)} onAdded={onAdded} />}
    </div>
  )
}

function Sparkline({ snapshots, color }: { snapshots: { followers: number }[]; color: string }) {
  if (snapshots.length < 2) return null
  const w = 64, h = 28
  const vals = snapshots.map(s => s.followers)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const pts = vals.map((v, i) => [
    (i / (vals.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2,
  ] as [number, number])
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-70">
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AccountCard({
  account,
  onDeleted,
}: {
  account: TrackedAccountWithSnapshots
  onDeleted: (id: string) => void
}) {
  const p = PLATFORMS[account.platform as Platform]
  const snapshots = [...(account.metric_snapshots ?? [])].sort(
    (a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime()
  )
  const latest = snapshots.at(-1)
  const prev = snapshots.at(-2)
  const diff = latest && prev ? latest.followers - prev.followers : null
  const diffPct = latest && prev && prev.followers > 0
    ? ((latest.followers - prev.followers) / prev.followers * 100)
    : null
  const [deleting, setDeleting] = useState(false)

  async function del() {
    if (!confirm(`@${account.username} hesabını silmek istiyor musun?`)) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('tracked_accounts').delete().eq('id', account.id)
    onDeleted(account.id)
  }

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3 group relative">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.bg}`} style={{ color: p.color }}>
          <PlatformIcon platform={account.platform as Platform} size={20} title={p.label} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[14px] truncate">{p.label}</p>
          <p className="text-white/40 text-[12px] truncate">@{account.username}</p>
        </div>
        <button
          onClick={del}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          {latest ? (
            <>
              <p className="text-[28px] font-bold text-white leading-none">
                {latest.followers.toLocaleString('tr-TR')}
              </p>
              <p className="text-white/40 text-[11px] mt-1">takipçi</p>
            </>
          ) : (
            <p className="text-white/30 text-[12px]">Henüz veri yok</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <Sparkline snapshots={snapshots.slice(-14)} color={p.color} />
          {diff !== null && (
            <div className="flex items-center gap-1">
              <span className={`text-[11px] font-semibold ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {diff >= 0 ? '+' : ''}{diff.toLocaleString('tr-TR')}
              </span>
              {diffPct !== null && (
                <span className={`text-[10px] ${diff >= 0 ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                  ({diffPct >= 0 ? '+' : ''}{diffPct.toFixed(1)}%)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <ChartGlyph size={48} className="text-white/25" />
      <div>
        <p className="text-white font-semibold text-[17px]">Henüz hesap yok</p>
        <p className="text-white/40 text-[13px] mt-1">İlk hesabını ekle ve takip etmeye başla</p>
      </div>
      <button
        onClick={onAdd}
        className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] text-white active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}
      >
        Hesap Ekle
      </button>
    </div>
  )
}

function AddAccountSheet({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: (acc: TrackedAccountWithSnapshots) => void
}) {
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    const trimmed = username.trim().replace(/^@/, '')
    if (!trimmed) return
    setSaving(true)
    const supabase = createClient()
    const uid = getBrowserUserId()
    if (!uid) { setSaving(false); return }
    const { data } = await supabase
      .from('tracked_accounts')
      .insert({ platform, username: trimmed, user_id: uid })
      .select('*, metric_snapshots(*)')
      .single()
    if (data) onAdded(data)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full md:max-w-md glass rounded-t-3xl md:rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-white">Hesap Ekle</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1" aria-label="Kapat">
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Platform picker */}
        <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-2">Platform</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {(Object.entries(PLATFORMS) as [Platform, (typeof PLATFORMS)[Platform]][]).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                platform === key
                  ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <PlatformIcon platform={key} size={15} /> {p.label}
            </button>
          ))}
        </div>

        {/* Username */}
        <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-2">
          {PLATFORMS[platform].label} Kullanıcı Adı
        </p>
        <div className="flex items-center glass rounded-xl px-4 h-12 gap-2 mb-5">
          <span className="text-white/40">@</span>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            placeholder="kullaniciadi"
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-white/25 outline-none text-[16px]"
          />
        </div>

        <button
          onClick={save}
          disabled={!username.trim() || saving}
          className="w-full h-12 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}
        >
          {saving ? 'Ekleniyor…' : 'Ekle'}
        </button>
      </div>
    </div>
  )
}
