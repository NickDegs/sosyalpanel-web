'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrackedAccountWithSnapshots, PLATFORMS, Platform } from '@/lib/types'

export default function DashboardClient({ initialAccounts }: { initialAccounts: TrackedAccountWithSnapshots[] }) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [showAdd, setShowAdd] = useState(false)

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
      <div className="flex items-center justify-between mb-6">
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

function AccountCard({ account, onDeleted }: { account: TrackedAccountWithSnapshots; onDeleted: (id: string) => void }) {
  const p = PLATFORMS[account.platform as Platform]
  const snapshots = [...(account.metric_snapshots ?? [])].sort((a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime())
  const latest = snapshots.at(-1)
  const prev = snapshots.at(-2)
  const diff = latest && prev ? latest.followers - prev.followers : null
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
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${p.bg}`}>
          {p.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[14px] truncate">{p.label}</p>
          <p className="text-white/40 text-[12px] truncate">@{account.username}</p>
        </div>
        <button onClick={del} disabled={deleting}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>

      {latest ? (
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[28px] font-bold text-white leading-none">{latest.followers.toLocaleString('tr-TR')}</p>
            <p className="text-white/40 text-[11px] mt-1">takipçi</p>
          </div>
          {diff !== null && (
            <span className={`text-[12px] font-semibold px-2 py-1 rounded-lg ${diff >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
              {diff >= 0 ? '+' : ''}{diff.toLocaleString('tr-TR')}
            </span>
          )}
        </div>
      ) : (
        <p className="text-white/30 text-[12px]">Henüz veri yok</p>
      )}
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="text-5xl">📊</div>
      <div>
        <p className="text-white font-semibold text-[17px]">Henüz hesap yok</p>
        <p className="text-white/40 text-[13px] mt-1">İlk hesabını ekle ve takip etmeye başla</p>
      </div>
      <button onClick={onAdd} className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] text-white"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}>
        Hesap Ekle
      </button>
    </div>
  )
}

function AddAccountSheet({ onClose, onAdded }: {
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('tracked_accounts')
      .insert({ platform, username: trimmed, user_id: user.id })
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
          <button onClick={onClose} className="text-white/40 hover:text-white p-1">✕</button>
        </div>

        {/* Platform picker */}
        <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-2">Platform</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(([key, p]) => (
            <button key={key} onClick={() => setPlatform(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                platform === key
                  ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
              }`}>
              <span>{p.icon}</span> {p.label}
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
