'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrackedAccountWithSnapshots, MetricSnapshot, PLATFORMS, Platform } from '@/lib/types'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Area, AreaChart, CartesianGrid, Legend,
} from 'recharts'

type DateRange = '7d' | '30d' | '90d' | 'all'
type Tab = 'chart' | 'compare' | 'update'

function getLatest(account: TrackedAccountWithSnapshots) {
  return account.metric_snapshots
    ?.slice()
    .sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())[0]
}

function filterByRange(snapshots: MetricSnapshot[], range: DateRange) {
  if (range === 'all') return snapshots
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const cutoff = Date.now() - days * 86400_000
  return snapshots.filter(s => new Date(s.captured_at).getTime() >= cutoff)
}

function growthRate(snapshots: MetricSnapshot[], range: DateRange): number | null {
  const filtered = filterByRange(snapshots, range)
    .sort((a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime())
  if (filtered.length < 2) return null
  const first = filtered[0].followers
  const last = filtered[filtered.length - 1].followers
  if (first === 0) return null
  return ((last - first) / first) * 100
}

function exportCSV(account: TrackedAccountWithSnapshots) {
  const sorted = [...(account.metric_snapshots ?? [])]
    .sort((a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime())
  const rows = ['Tarih,Takipçi,Takip Edilen,Gönderi']
  sorted.forEach(s => {
    const d = new Date(s.captured_at).toISOString().slice(0, 10)
    rows.push(`${d},${s.followers},${s.following ?? ''},${s.posts ?? ''}`)
  })
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${account.platform}_${account.username}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AnalyticsClient({ initialAccounts }: { initialAccounts: TrackedAccountWithSnapshots[] }) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [selected, setSelected] = useState(initialAccounts[0]?.id ?? '')
  const [tab, setTab] = useState<Tab>('chart')
  const [range, setRange] = useState<DateRange>('30d')

  const account = accounts.find(a => a.id === selected) ?? accounts[0]

  const summary = useMemo(() => {
    const total = accounts.reduce((s, a) => s + (getLatest(a)?.followers ?? 0), 0)
    const best = accounts.reduce<TrackedAccountWithSnapshots | null>(
      (best, a) => (getLatest(a)?.followers ?? 0) > (best ? getLatest(best)?.followers ?? 0 : -1) ? a : best,
      null
    )
    const totalGrowth = accounts.reduce((s, a) => {
      const g = growthRate(a.metric_snapshots ?? [], range)
      return s + (g ?? 0)
    }, 0) / (accounts.filter(a => (a.metric_snapshots?.length ?? 0) >= 2).length || 1)
    return { total, best, totalGrowth }
  }, [accounts, range])

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
    <div className="p-5 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-bold text-white">Analiz</h1>
        {/* Date range */}
        <div className="glass rounded-xl p-1 flex gap-0.5">
          {(['7d', '30d', '90d', 'all'] as DateRange[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                range === r ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {r === 'all' ? 'Tümü' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass rounded-2xl p-4">
          <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-1">Toplam Erişim</p>
          <p className="text-white text-[22px] font-bold">{summary.total.toLocaleString('tr-TR')}</p>
          <p className="text-white/40 text-[11px] mt-0.5">toplam takipçi</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-1">Büyüme</p>
          <p className={`text-[22px] font-bold ${summary.totalGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {summary.totalGrowth >= 0 ? '+' : ''}{summary.totalGrowth.toFixed(1)}%
          </p>
          <p className="text-white/40 text-[11px] mt-0.5">seçili dönem</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-1">En İyi</p>
          {summary.best ? (
            <>
              <p className="text-white text-[14px] font-bold truncate">
                {PLATFORMS[summary.best.platform as Platform]?.icon} @{summary.best.username}
              </p>
              <p className="text-white/40 text-[11px] mt-0.5">
                {(getLatest(summary.best)?.followers ?? 0).toLocaleString('tr-TR')} takipçi
              </p>
            </>
          ) : <p className="text-white/40 text-[13px]">—</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-xl p-1 flex gap-1 w-fit mb-6">
        {([
          ['chart', 'Grafik'],
          ['compare', 'Karşılaştır'],
          ['update', 'Güncelle'],
        ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
              tab === t ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'chart' && (
        <>
          {/* Account selector */}
          <div className="flex flex-wrap gap-2 mb-5">
            {accounts.map(acc => {
              const p = PLATFORMS[acc.platform as Platform]
              const g = growthRate(acc.metric_snapshots ?? [], range)
              return (
                <button
                  key={acc.id}
                  onClick={() => setSelected(acc.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                    selected === acc.id
                      ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span>{p.icon}</span> @{acc.username}
                  {g !== null && (
                    <span className={`text-[10px] font-bold ${g >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {g >= 0 ? '+' : ''}{g.toFixed(1)}%
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {account && (
            <SingleAccountChart account={account} range={range} onExport={() => exportCSV(account)} />
          )}
        </>
      )}

      {tab === 'compare' && (
        <ComparisonChart accounts={accounts} range={range} />
      )}

      {tab === 'update' && (
        <div className="flex flex-col gap-4">
          {accounts.map(acc => (
            <MetricEntryCard
              key={acc.id}
              account={acc}
              onAdded={snap => onSnapshotAdded(acc.id, snap)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SingleAccountChart({
  account,
  range,
  onExport,
}: {
  account: TrackedAccountWithSnapshots
  range: DateRange
  onExport: () => void
}) {
  const p = PLATFORMS[account.platform as Platform]
  const snapshots = filterByRange(account.metric_snapshots ?? [], range)
    .sort((a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime())
    .map(s => ({
      date: new Date(s.captured_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      followers: s.followers,
      following: s.following,
    }))

  const latest = [...(account.metric_snapshots ?? [])]
    .sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())[0]
  const growth = growthRate(account.metric_snapshots ?? [], range)
  const earliest = snapshots[0]
  const diff = latest && earliest ? latest.followers - earliest.followers : null

  return (
    <div className="glass rounded-2xl p-5">
      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{p.icon}</span>
            <span className="text-white font-semibold">{p.label} · @{account.username}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-[32px] font-bold text-white">{latest?.followers.toLocaleString('tr-TR') ?? '—'}</span>
            {diff !== null && (
              <span className={`text-[14px] font-semibold ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {diff >= 0 ? '+' : ''}{diff.toLocaleString('tr-TR')}
              </span>
            )}
            {growth !== null && (
              <span className={`text-[13px] ${growth >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current strokeWidth={2}">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV
        </button>
      </div>

      {snapshots.length < 2 ? (
        <div className="flex flex-col items-center py-10 gap-2 text-center">
          <div className="text-4xl">📊</div>
          <p className="text-white/40 text-[13px]">En az 2 veri noktası gerekli.</p>
          <p className="text-white/25 text-[12px]">Güncelle sekmesinden ekleyin.</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={snapshots} margin={{ left: -10, right: 0 }}>
              <defs>
                <linearGradient id={`grad-${account.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={p.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={p.color} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(20,10,40,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 13,
                }}
                formatter={(v) => [(v as number).toLocaleString('tr-TR'), 'Takipçi']}
              />
              <Area
                type="monotone"
                dataKey="followers"
                stroke={p.color}
                strokeWidth={2.5}
                fill={`url(#grad-${account.id})`}
                dot={false}
                activeDot={{ r: 5, fill: p.color }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Insights row */}
          {snapshots.length >= 7 && (
            <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.06]">
              {[
                {
                  label: 'Günlük Ort.',
                  value: diff !== null
                    ? `${(diff / Math.max(snapshots.length - 1, 1) >= 0 ? '+' : '')}${Math.round(diff / Math.max(snapshots.length - 1, 1)).toLocaleString('tr-TR')}`
                    : '—',
                },
                {
                  label: 'Maks.',
                  value: Math.max(...snapshots.map(s => s.followers)).toLocaleString('tr-TR'),
                },
                {
                  label: 'Min.',
                  value: Math.min(...snapshots.map(s => s.followers)).toLocaleString('tr-TR'),
                },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">{label}</p>
                  <p className="text-white text-[14px] font-bold mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ComparisonChart({
  accounts,
  range,
}: {
  accounts: TrackedAccountWithSnapshots[]
  range: DateRange
}) {
  // Normalize to % change from first datapoint for fair comparison
  const datasets = accounts
    .filter(a => filterByRange(a.metric_snapshots ?? [], range).length >= 2)
    .map(a => {
      const sorted = filterByRange(a.metric_snapshots ?? [], range)
        .sort((x, y) => new Date(x.captured_at).getTime() - new Date(y.captured_at).getTime())
      const base = sorted[0].followers
      return {
        id: a.id,
        label: `@${a.username}`,
        platform: a.platform as Platform,
        color: PLATFORMS[a.platform as Platform].color,
        data: sorted.map(s => ({
          date: new Date(s.captured_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
          [a.id]: base > 0 ? +((s.followers - base) / base * 100).toFixed(2) : 0,
        })),
      }
    })

  if (datasets.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-white/40 text-[13px]">
          Karşılaştırma için en az 2 hesapta 2&apos;şer veri noktası olmalı.
        </p>
      </div>
    )
  }

  // Merge all data by date
  const allDates = [...new Set(datasets.flatMap(d => d.data.map(p => p.date)))]
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const merged = allDates.map(date => {
    const row: Record<string, string | number> = { date }
    datasets.forEach(d => {
      const point = d.data.find(p => p.date === date)
      if (point) row[d.id] = point[d.id] as number
    })
    return row
  })

  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-white font-semibold mb-1">Büyüme Karşılaştırması</p>
      <p className="text-white/40 text-[12px] mb-5">Seçilen döneme göre % büyüme</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={merged} margin={{ left: -10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v > 0 ? '+' : ''}${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(20,10,40,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 13,
            }}
            formatter={(v, _name, props) => {
              const ds = datasets.find(d => d.id === props.dataKey)
              return [`${(v as number) > 0 ? '+' : ''}${(v as number).toFixed(2)}%`, ds?.label ?? '']
            }}
          />
          <Legend
            formatter={value => {
              const ds = datasets.find(d => d.id === value)
              return <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{ds?.label ?? value}</span>
            }}
          />
          {datasets.map(d => (
            <Line
              key={d.id}
              type="monotone"
              dataKey={d.id}
              stroke={d.color === '#000000' ? '#888' : d.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function MetricEntryCard({
  account,
  onAdded,
}: {
  account: TrackedAccountWithSnapshots
  onAdded: (snap: MetricSnapshot) => void
}) {
  const [followers, setFollowers] = useState('')
  const [following, setFollowing] = useState('')
  const [posts, setPosts] = useState('')
  const [saving, setSaving] = useState(false)
  const p = PLATFORMS[account.platform as Platform]
  const latest = account.metric_snapshots
    ?.slice()
    .sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())[0]

  async function save() {
    const f = parseInt(followers.replace(/\D/g, ''))
    if (isNaN(f)) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('metric_snapshots')
      .insert({
        account_id: account.id,
        followers: f,
        following: following ? parseInt(following.replace(/\D/g, '')) : null,
        posts: posts ? parseInt(posts.replace(/\D/g, '')) : null,
      })
      .select()
      .single()
    if (data) onAdded(data)
    setFollowers('')
    setFollowing('')
    setPosts('')
    setSaving(false)
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${p.bg}`}>
          {p.icon}
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-[14px]">{p.label}</p>
          <p className="text-white/40 text-[12px]">@{account.username}</p>
        </div>
        {latest && (
          <div className="text-right">
            <p className="text-[18px] font-bold text-violet-400">{latest.followers.toLocaleString('tr-TR')}</p>
            <p className="text-white/30 text-[10px]">mevcut</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <input
          value={followers}
          onChange={e => setFollowers(e.target.value)}
          placeholder="Takipçi *"
          inputMode="numeric"
          onKeyDown={e => e.key === 'Enter' && save()}
          className="bg-white/5 border border-white/10 rounded-xl px-3 h-10 text-white placeholder-white/25 outline-none text-[14px] focus:border-violet-500/50"
        />
        <input
          value={following}
          onChange={e => setFollowing(e.target.value)}
          placeholder="Takip"
          inputMode="numeric"
          className="bg-white/5 border border-white/10 rounded-xl px-3 h-10 text-white placeholder-white/25 outline-none text-[14px] focus:border-violet-500/50"
        />
        <div className="flex gap-2">
          <input
            value={posts}
            onChange={e => setPosts(e.target.value)}
            placeholder="Gönderi"
            inputMode="numeric"
            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 h-10 text-white placeholder-white/25 outline-none text-[14px] focus:border-violet-500/50"
          />
          <button
            onClick={save}
            disabled={!followers || saving}
            className="px-3 h-10 rounded-xl font-semibold text-[13px] text-white disabled:opacity-40 transition-all active:scale-95 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}
          >
            {saving ? '…' : '✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
