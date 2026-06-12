'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrackedAccountWithSnapshots, MetricSnapshot, PLATFORMS, Platform } from '@/lib/types'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid,
} from 'recharts'

export default function AnalyticsClient({ initialAccounts }: { initialAccounts: TrackedAccountWithSnapshots[] }) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [selected, setSelected] = useState(initialAccounts[0]?.id ?? '')
  const [tab, setTab] = useState<'chart' | 'update'>('chart')

  const account = accounts.find(a => a.id === selected) ?? accounts[0]

  function onSnapshotAdded(accountId: string, snap: MetricSnapshot) {
    setAccounts(prev => prev.map(a =>
      a.id === accountId
        ? { ...a, metric_snapshots: [...(a.metric_snapshots ?? []), snap] }
        : a
    ))
  }

  if (accounts.length === 0) {
    return (
      <div className="p-5 md:p-8">
        <h1 className="text-[28px] font-bold text-white mb-6">Analiz</h1>
        <div className="flex flex-col items-center py-20 gap-3 text-center">
          <div className="text-5xl">📈</div>
          <p className="text-white font-semibold text-[17px]">Henüz hesap yok</p>
          <p className="text-white/40 text-[13px]">Dashboard&apos;dan hesap ekleyin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      <h1 className="text-[28px] font-bold text-white mb-5">Analiz</h1>

      {/* Segmented control */}
      <div className="glass rounded-xl p-1 flex gap-1 w-fit mb-6">
        {(['chart', 'update'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
              tab === t ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
            }`}>
            {t === 'chart' ? 'Grafikler' : 'Güncelle'}
          </button>
        ))}
      </div>

      {tab === 'chart' ? (
        <>
          {/* Account selector */}
          <div className="flex flex-wrap gap-2 mb-5">
            {accounts.map(acc => {
              const p = PLATFORMS[acc.platform as Platform]
              return (
                <button key={acc.id} onClick={() => setSelected(acc.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                    selected === acc.id
                      ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}>
                  <span>{p.icon}</span> @{acc.username}
                </button>
              )
            })}
          </div>

          {account && <FollowerChart account={account} />}
        </>
      ) : (
        <div className="flex flex-col gap-4">
          {accounts.map(acc => (
            <MetricEntryCard key={acc.id} account={acc} onAdded={snap => onSnapshotAdded(acc.id, snap)} />
          ))}
        </div>
      )}
    </div>
  )
}

function FollowerChart({ account }: { account: TrackedAccountWithSnapshots }) {
  const p = PLATFORMS[account.platform as Platform]
  const snapshots = [...(account.metric_snapshots ?? [])]
    .sort((a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime())
    .slice(-30)
    .map(s => ({
      date: new Date(s.captured_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      followers: s.followers,
    }))

  const latest = account.metric_snapshots?.slice().sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())[0]

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-semibold">Takipçi Geçmişi</p>
        {latest && (
          <span className="text-[13px] font-bold px-3 py-1 rounded-xl text-violet-300 bg-violet-500/15">
            {latest.followers.toLocaleString('tr-TR')}
          </span>
        )}
      </div>

      {snapshots.length < 2 ? (
        <div className="flex flex-col items-center py-10 gap-2 text-center">
          <div className="text-4xl">📊</div>
          <p className="text-white/40 text-[13px]">En az 2 veri gerekli. Güncelle sekmesinden ekleyin.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={snapshots}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={p.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={p.color} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'rgba(20,10,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 13 }}
              formatter={(v) => [(v as number).toLocaleString('tr-TR'), 'Takipçi']}
            />
            <Area type="monotone" dataKey="followers" stroke={p.color} strokeWidth={2.5} fill="url(#grad)" dot={{ fill: p.color, r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

function MetricEntryCard({ account, onAdded }: {
  account: TrackedAccountWithSnapshots
  onAdded: (snap: MetricSnapshot) => void
}) {
  const [followers, setFollowers] = useState('')
  const [following, setFollowing] = useState('')
  const [saving, setSaving] = useState(false)
  const p = PLATFORMS[account.platform as Platform]
  const latest = account.metric_snapshots?.slice().sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())[0]

  async function save() {
    const f = parseInt(followers.replace(/\D/g, ''))
    if (isNaN(f)) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('metric_snapshots')
      .insert({ account_id: account.id, followers: f, following: following ? parseInt(following.replace(/\D/g, '')) : null })
      .select()
      .single()
    if (data) onAdded(data)
    setFollowers('')
    setFollowing('')
    setSaving(false)
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${p.bg}`}>{p.icon}</div>
        <div className="flex-1">
          <p className="text-white font-semibold text-[14px]">{p.label}</p>
          <p className="text-white/40 text-[12px]">@{account.username}</p>
        </div>
        {latest && <span className="text-[20px] font-bold text-violet-400">{latest.followers.toLocaleString('tr-TR')}</span>}
      </div>
      <div className="flex gap-2">
        <input value={followers} onChange={e => setFollowers(e.target.value)} placeholder="Takipçi"
          inputMode="numeric" onKeyDown={e => e.key === 'Enter' && save()}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 h-10 text-white placeholder-white/25 outline-none text-[14px] focus:border-violet-500/50" />
        <input value={following} onChange={e => setFollowing(e.target.value)} placeholder="Takip (isteğe bağlı)"
          inputMode="numeric"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 h-10 text-white placeholder-white/25 outline-none text-[14px] focus:border-violet-500/50" />
        <button onClick={save} disabled={!followers || saving}
          className="px-4 h-10 rounded-xl font-semibold text-[13px] text-white disabled:opacity-40 flex-shrink-0 transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}>
          {saving ? '…' : 'Kaydet'}
        </button>
      </div>
    </div>
  )
}
