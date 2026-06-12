const SECTIONS = [
  {
    icon: '🕐', title: 'En İyi Paylaşım Saatleri',
    tips: [
      { icon: '📸', title: 'Instagram',  body: 'Salı–Cuma, 09:00–11:00 ve 18:00–20:00'        },
      { icon: '🧵', title: 'Threads',    body: 'Hafta içi sabahları 08:00–10:00'               },
      { icon: '🤖', title: 'Reddit',     body: 'Pazartesi–Cuma, 08:00–12:00 (EST)'            },
      { icon: '🦋', title: 'Bluesky',   body: 'Hafta içi öğle arası 12:00–14:00'             },
      { icon: '🐘', title: 'Mastodon',  body: 'Akşamları 19:00–22:00'                         },
    ],
  },
  {
    icon: '💡', title: 'İçerik Fikirleri',
    tips: [
      { icon: '❓', title: 'Soru-Cevap',    body: 'Takipçilerinize soru sorun, etkileşim artar.'     },
      { icon: '📋', title: 'Top 5 / Top 10', body: 'Liste formatındaki içerikler daha çok paylaşılır.' },
      { icon: '⚡', title: 'Kısa İpuçları',  body: 'Alanınızda 1 cümlelik hızlı ipuçları paylaşın.'  },
      { icon: '🕰️', title: 'Geçmişe Bakış', body: 'Bu gün X yıl önce ne oldu? formatı ilgi çeker.'  },
    ],
  },
  {
    icon: '#️⃣', title: 'Hashtag Stratejisi',
    tips: [
      { icon: '3️⃣', title: 'Instagram: 3–5 hashtag', body: 'Çok fazla hashtag görünürlüğü düşürebilir.'     },
      { icon: '2️⃣', title: 'Threads: 1–2 hashtag',   body: 'Platformun algoritması az hashtag tercih eder.' },
      { icon: '#️⃣', title: 'Mastodon: Konu bazlı',   body: 'Toplulukla alakalı spesifik hashtagler kullanın.' },
    ],
  },
]

export default function TipsPage() {
  return (
    <div className="p-5 md:p-8 max-w-2xl">
      <h1 className="text-[28px] font-bold text-white mb-6">İçerik Önerileri</h1>

      <div className="flex flex-col gap-4">
        {SECTIONS.map(section => (
          <div key={section.title} className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <span className="text-lg">{section.icon}</span>
              <p className="text-white/50 text-[13px] font-semibold">{section.title}</p>
            </div>
            {section.tips.map((tip, i) => (
              <div key={tip.title}>
                <div className="flex items-start gap-4 px-4 py-3">
                  <span className="text-2xl w-8 text-center flex-shrink-0 mt-0.5">{tip.icon}</span>
                  <div>
                    <p className="text-white text-[14px] font-medium">{tip.title}</p>
                    <p className="text-white/40 text-[12px] mt-0.5 leading-relaxed">{tip.body}</p>
                  </div>
                </div>
                {i < section.tips.length - 1 && <div className="border-b border-white/[0.06] ml-16" />}
              </div>
            ))}
          </div>
        ))}

        <div className="glass rounded-2xl p-4 flex items-start gap-3">
          <span className="text-[18px]">🛡️</span>
          <p className="text-white/35 text-[12px] leading-relaxed">
            Bu uygulama hesaplarınızda otomatik aksiyon <strong className="text-white/50">ALMAZ</strong>. Tüm paylaşımları kendiniz gerçekleştirirsiniz. Platform kullanım koşullarına tam uyum.
          </p>
        </div>
      </div>
    </div>
  )
}
