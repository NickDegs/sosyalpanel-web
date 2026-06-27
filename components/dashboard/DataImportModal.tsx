'use client'

import { useState } from 'react'
import { Platform, PLATFORMS } from '@/lib/types'
import { analyzeGeneric, analyzeTikTok, FollowAnalysis, FollowUser } from '@/lib/followAnalysis'
import { CloseIcon } from '@/components/icons/Glyphs'

// Resmi veri içe aktarma — Instagram/TikTok "Verilerini İndir" dosyalarından
// takip analizi (geri takip etmeyen). Tüm işlem tarayıcıda; sunucuya gitmez.
export default function DataImportModal({
  platform,
  username,
  onClose,
}: {
  platform: Platform
  username: string
  onClose: () => void
}) {
  const isTikTok = platform === 'tiktok'
  const [followersFile, setFollowersFile] = useState<File | null>(null)
  const [followingFile, setFollowingFile] = useState<File | null>(null)
  const [combinedFile, setCombinedFile] = useState<File | null>(null)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<FollowAnalysis | null>(null)
  const [tab, setTab] = useState<0 | 1>(0)

  const ready = isTikTok ? !!combinedFile : !!followersFile && !!followingFile

  async function run() {
    setWorking(true); setError(null)
    try {
      let result: FollowAnalysis | null = null
      if (isTikTok && combinedFile) {
        result = analyzeTikTok(await combinedFile.text())
      } else if (followersFile && followingFile) {
        result = analyzeGeneric(await followersFile.text(), await followingFile.text(), platform)
      }
      if (result) setAnalysis(result)
      else setError('Dosya okunamadı. JSON formatında ve doğru dosyaları seçtiğinden emin ol.')
    } catch {
      setError('Dosya işlenirken hata oluştu.')
    } finally {
      setWorking(false)
    }
  }

  const steps = isTikTok
    ? ['TikTok → Ayarlar → Hesap → Verilerini indir', 'Format JSON seç, talebi gönder',
       'Hazır olunca indir, ZIP\'i aç', 'user_data.json dosyasını seç']
    : ['Instagram → Ayarlar → Hesap Merkezi → Bilgilerini indir', 'Format JSON, içerik: Takipçiler ve takip edilenler',
       'Hazır olunca indir, ZIP\'i aç', 'followers_1.json ve following.json dosyalarını seç']

  const list = analysis ? (tab === 0 ? analysis.notFollowingBack : analysis.youDontFollowBack) : []

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full md:max-w-lg glass rounded-t-3xl md:rounded-3xl p-6 border border-white/10 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-white">
            {analysis ? 'Takip Analizi' : 'Veri İçe Aktar'} <span className="text-white/40 text-[13px]">@{username}</span>
          </h2>
          <div className="flex items-center gap-2">
            {analysis && <button onClick={() => setAnalysis(null)} className="text-[13px] text-violet-300">Yeniden</button>}
            <button onClick={onClose} className="text-white/40 hover:text-white p-1" aria-label="Kapat"><CloseIcon size={18} /></button>
          </div>
        </div>

        {analysis ? (
          <>
            {/* Özet */}
            <div className="flex gap-3 mb-4">
              <Stat label="Takipçi" value={analysis.followerCount} />
              <Stat label="Takip" value={analysis.followingCount} />
              <Stat label="Karşılıklı" value={analysis.mutualCount} />
            </div>
            {/* Sekmeler */}
            <div className="flex gap-2 mb-3">
              <TabBtn active={tab === 0} onClick={() => setTab(0)}>Geri takip etmeyen ({analysis.notFollowingBack.length})</TabBtn>
              <TabBtn active={tab === 1} onClick={() => setTab(1)}>Takip etmediklerin ({analysis.youDontFollowBack.length})</TabBtn>
            </div>
            {list.length === 0 ? (
              <p className="text-white/50 text-[14px] text-center py-8">
                {tab === 0 ? 'Herkes geri takip ediyor 🎉' : 'Hepsini geri takip ediyorsun 👍'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {list.map(u => <UserRow key={u.id} u={u} />)}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Rehber */}
            <div className="glass rounded-xl p-4 mb-4">
              <p className="text-white font-semibold text-[13px] mb-2">Veri dosyasını nasıl alırım?</p>
              <ul className="space-y-1">
                {steps.map((s, i) => (
                  <li key={i} className="text-white/60 text-[12px] flex gap-2"><span className="text-white/30">•</span>{s}</li>
                ))}
              </ul>
            </div>

            {isTikTok ? (
              <FilePick label="TikTok veri dosyası (user_data.json)" file={combinedFile} onPick={f => { setCombinedFile(f); setError(null) }} />
            ) : (
              <>
                <FilePick label="Takipçiler (followers_1.json)" file={followersFile} onPick={f => { setFollowersFile(f); setError(null) }} />
                <FilePick label="Takip edilenler (following.json)" file={followingFile} onPick={f => { setFollowingFile(f); setError(null) }} />
              </>
            )}

            {error && <p className="text-red-400 text-[13px] mt-3">{error}</p>}

            <button
              onClick={run}
              disabled={!ready || working}
              className="w-full h-12 rounded-xl font-semibold text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40 mt-4"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)' }}
            >
              {working ? 'İşleniyor…' : 'Analiz Et'}
            </button>

            <p className="text-white/40 text-[12px] mt-3 flex items-start gap-2">
              <span className="text-emerald-400">🔒</span>
              Dosyalar yalnızca tarayıcında işlenir. Hiçbir yere yüklenmez, şifre istenmez.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function FilePick({ label, file, onPick }: { label: string; file: File | null; onPick: (f: File) => void }) {
  return (
    <label className="glass rounded-xl px-4 py-3 mb-2 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all">
      <span className={file ? 'text-emerald-400' : 'text-white/40'}>{file ? '✓' : '⬆'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[13px] font-medium truncate">{label}</p>
        <p className="text-white/40 text-[12px] truncate">{file?.name ?? 'Dosya seç'}</p>
      </div>
      <span className="text-violet-300 text-[13px] font-semibold">Seç</span>
      <input
        type="file"
        accept=".json,application/json,.html,text/html"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onPick(f) }}
      />
    </label>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-xl flex-1 py-3 text-center">
      <p className="text-white text-[18px] font-bold">{value.toLocaleString('tr-TR')}</p>
      <p className="text-white/40 text-[11px]">{label}</p>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
        active ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'bg-white/5 text-white/60 border border-transparent'
      }`}
    >
      {children}
    </button>
  )
}

function UserRow({ u }: { u: FollowUser }) {
  const content = (
    <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-[15px]">
        {u.displayName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[14px] font-semibold truncate">{u.displayName}</p>
        <p className="text-white/40 text-[12px] truncate">{u.handle}</p>
      </div>
      {u.profileUrl && <span className="text-white/30 text-[13px]">↗</span>}
    </div>
  )
  return u.profileUrl
    ? <a href={u.profileUrl} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">{content}</a>
    : content
}
