'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="p-5 md:p-8 max-w-xl">
      <h1 className="text-[28px] font-bold text-white mb-6">Ayarlar</h1>

      <div className="flex flex-col gap-4">
        {/* App info */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Uygulama</p>
          </div>
          <Row label="Versiyon" value="1.0.0" />
          <div className="border-t border-white/[0.06]" />
          <Row label="Platform" value="Web / PWA" />
          <div className="border-t border-white/[0.06]" />
          <Row label="Domain" value="realvirtuality.app" />
        </div>

        {/* Account */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">Hesap</p>
          </div>
          <div className="px-4 py-3">
            <button
              onClick={signOut}
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-[14px] text-red-400 bg-red-400/10 hover:bg-red-400/15 transition-all disabled:opacity-50"
            >
              {loading ? 'Çıkış yapılıyor…' : 'Çıkış Yap'}
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="glass rounded-2xl p-4 flex items-start gap-3">
          <span className="text-lg">🛡️</span>
          <p className="text-white/35 text-[12px] leading-relaxed">
            Verileriniz Supabase altyapısında şifreli olarak saklanır. Üçüncü taraflarla paylaşılmaz.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-white/60 text-[14px]">{label}</span>
      <span className="text-white/40 text-[14px]">{value}</span>
    </div>
  )
}
