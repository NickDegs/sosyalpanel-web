import { ClockIcon, BulbIcon, HashIcon, ShieldIcon } from '@/components/icons/Glyphs'
import { PlatformIcon } from '@/components/icons/PlatformIcon'
import type { Platform } from '@/lib/types'
import type { ComponentType } from 'react'

type Tip = { title: string; body: string; platform?: Platform }
type Section = { Icon: ComponentType<{ size?: number; className?: string }>; title: string; tips: Tip[] }

const SECTIONS: Section[] = [
  {
    Icon: ClockIcon, title: 'En İyi Paylaşım Saatleri',
    tips: [
      { platform: 'instagram', title: 'Instagram', body: 'Salı–Cuma, 09:00–11:00 ve 18:00–20:00' },
      { platform: 'threads',   title: 'Threads',   body: 'Hafta içi sabahları 08:00–10:00' },
      { platform: 'reddit',    title: 'Reddit',    body: 'Pazartesi–Cuma, 08:00–12:00 (EST)' },
      { platform: 'bluesky',   title: 'Bluesky',   body: 'Hafta içi öğle arası 12:00–14:00' },
      { platform: 'mastodon',  title: 'Mastodon',  body: 'Akşamları 19:00–22:00' },
    ],
  },
  {
    Icon: BulbIcon, title: 'İçerik Fikirleri',
    tips: [
      { title: 'Soru-Cevap',     body: 'Takipçilerinize soru sorun, etkileşim artar.' },
      { title: 'Top 5 / Top 10', body: 'Liste formatındaki içerikler daha çok paylaşılır.' },
      { title: 'Kısa İpuçları',  body: 'Alanınızda 1 cümlelik hızlı ipuçları paylaşın.' },
      { title: 'Geçmişe Bakış',  body: 'Bu gün X yıl önce ne oldu? formatı ilgi çeker.' },
    ],
  },
  {
    Icon: HashIcon, title: 'Hashtag Stratejisi',
    tips: [
      { title: 'Instagram: 3–5 hashtag', body: 'Çok fazla hashtag görünürlüğü düşürebilir.' },
      { title: 'Threads: 1–2 hashtag',   body: 'Platformun algoritması az hashtag tercih eder.' },
      { title: 'Mastodon: Konu bazlı',   body: 'Toplulukla alakalı spesifik hashtagler kullanın.' },
    ],
  },
]

export default function TipsPage() {
  return (
    <div className="p-5 md:p-8 max-w-2xl">
      <h1 className="text-[28px] font-bold text-white mb-6">İçerik Önerileri</h1>

      <div className="flex flex-col gap-4">
        {SECTIONS.map(({ Icon, title, tips }) => (
          <div key={title} className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <Icon size={17} className="text-white/55" />
              <p className="text-white/50 text-[13px] font-semibold">{title}</p>
            </div>
            {tips.map((tip, i) => (
              <div key={tip.title}>
                <div className="flex items-start gap-4 px-4 py-3">
                  <span className="w-8 flex-shrink-0 mt-0.5 flex items-center justify-center text-white/40">
                    {tip.platform
                      ? <PlatformIcon platform={tip.platform} size={18} />
                      : <span className="text-[13px] font-semibold tabular-nums">{String(i + 1).padStart(2, '0')}</span>}
                  </span>
                  <div>
                    <p className="text-white text-[14px] font-medium">{tip.title}</p>
                    <p className="text-white/40 text-[12px] mt-0.5 leading-relaxed">{tip.body}</p>
                  </div>
                </div>
                {i < tips.length - 1 && <div className="border-b border-white/[0.06] ml-16" />}
              </div>
            ))}
          </div>
        ))}

        <div className="glass rounded-2xl p-4 flex items-start gap-3">
          <ShieldIcon size={18} className="text-white/40 flex-shrink-0 mt-0.5" />
          <p className="text-white/35 text-[12px] leading-relaxed">
            Bu uygulama hesaplarınızda otomatik aksiyon <strong className="text-white/50">ALMAZ</strong>. Tüm paylaşımları kendiniz gerçekleştirirsiniz. Platform kullanım koşullarına tam uyum.
          </p>
        </div>
      </div>
    </div>
  )
}
