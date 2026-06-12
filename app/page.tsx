'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function signInWithApple() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(124,58,237,0.45) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 85% 85%, rgba(37,99,235,0.3) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 70%, rgba(76,29,149,0.2) 0%, transparent 60%), #06030F'
        }} />
      </div>

      <div className="w-full max-w-sm px-8 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-[28px] blur-2xl opacity-60"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #1D4ED8)', transform: 'scale(1.3)' }} />
            <div className="relative w-24 h-24 rounded-[28px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #A855F7, #3B82F6)' }}>
              <span className="text-white font-black text-4xl" style={{ fontFamily: '-apple-system, system-ui' }}>SP</span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-[34px] font-bold text-white" style={{ letterSpacing: '-0.5px' }}>Social Panel</h1>
            <p className="text-white/50 mt-1 text-[15px]">Tüm sosyal medyan, tek ekranda</p>
          </div>
        </div>

        {/* Apple Sign In */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={signInWithApple}
            disabled={loading}
            className="w-full h-[54px] rounded-2xl flex items-center justify-center gap-2.5 text-white font-semibold text-[17px] transition-all duration-200 active:scale-[0.97] disabled:opacity-50 glass"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple ile Giriş Yap
              </>
            )}
          </button>
        </div>

        <p className="text-white/25 text-[11px] text-center leading-relaxed">
          Devam ederek Gizlilik Politikası ve Kullanım<br />Koşulları&apos;nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  )
}
