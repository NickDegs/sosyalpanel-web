'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MetricSnapshot, TrackedAccountWithSnapshots, PLATFORMS, Platform } from '@/lib/types'
import { CloseIcon } from '@/components/icons/Glyphs'

// Manuel sayaç — kullanıcı takipçi/takip/gönderi sayısını elle girer.
// Yeni bir metric_snapshots satırı oluşturur; büyüme grafiği + trend bundan beslenir.
export default function ManualEntryModal({
  account,
  onClose,
  onSnapshot,
}: {
  account: TrackedAccountWithSnapshots
  onClose: () => void
  onSnapshot: (accountId: string, snap: MetricSnapshot) => void
}) {
  const p = PLATFORMS[account.platform as Platform]
  const latest = [...(account.metric_snapshots ?? [])]
    .sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())[0]

  const [followers, setFollowers] = useState(latest ? String(latest.followers) : '')
  const [following, setFollowing] = useState(latest?.following != null ? String(latest.following) : '')
  const [posts, setPosts] = useState(latest?.posts != null ? String(latest.posts) : '')
  const [saving, setSaving] = useState(false)

  const num = (s: string) => { const n = parseInt(s.replace(/\D/g, ''), 10); return Number.isNaN(n) ? null : n }

  async function save() {
    const f = num(followers)
    if (f === null) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('metric_snapshots')
      .insert({ account_id: account.id, followers: f, following: num(following), posts: num(posts) })
      .select('*')
      .single()
    if (data) onSnapshot(account.id, data as MetricSnapshot)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full md:max-w-md glass rounded-t-3xl md:rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-white">Veri Gir <span className="text-white/40 text-[13px]">@{account.username}</span></h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1" aria-label="Kapat"><CloseIcon size={18} /></button>
        </div>

        <Field label="Takipçi *" value={followers} onChange={setFollowers} color={p.color} />
        <Field label="Takip edilen" value={following} onChange={setFollowing} />
        <Field label="Gönderi" value={posts} onChange={setPosts} />

        {latest && (
          <p className="text-white/40 text-[12px] mb-4">
            Son kayıt: {latest.followers.toLocaleString('tr-TR')} takipçi
          </p>
        )}

        <button
          onClick={save}
          disabled={num(followers) === null || saving}
          className="w-full h-12 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}
        >
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
        <p className="text-white/40 text-[12px] mt-3">📈 Her giriş büyüme grafiğine ve trend hesabına eklenir.</p>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, color }: { label: string; value: string; onChange: (s: string) => void; color?: string }) {
  return (
    <div className="mb-3">
      <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1.5">{label}</p>
      <div className="flex items-center glass rounded-xl px-4 h-12 gap-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color ?? '#3B82F6' }} />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          inputMode="numeric"
          placeholder="0"
          className="flex-1 bg-transparent text-white placeholder-white/25 outline-none text-[16px]"
        />
      </div>
    </div>
  )
}
