import type { Metadata } from 'next'
import Link from 'next/link'
import s from '../legal.module.css'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'Social Panel kullanım koşulları.',
}

export default function TermsPage() {
  return (
    <main className={s.wrap}>
      <Link href="/" className={s.back}>← Social Panel</Link>
      <h1>Kullanım Koşulları</h1>
      <p className={s.meta}>Son güncelleme: 17 Haziran 2026</p>

      <p>
        Social Panel&apos;i kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Lütfen dikkatlice
        okuyun.
      </p>

      <h2>Hizmetin Tanımı</h2>
      <p>
        Social Panel, birden çok sosyal medya hesabınızın takipçi ve etkileşim metriklerini elle
        kaydedip görselleştirmenizi sağlayan bir izleme ve analiz aracıdır. Uygulama, hesaplarınıza
        bağlanmaz ve sizin adınıza paylaşım, takip veya başka bir otomatik işlem yapmaz.
      </p>

      <h2>Sorumluluk Reddi</h2>
      <ul>
        <li>Uygulama, sosyal medya platformlarının resmî bir ürünü değildir; onlarla ortaklığı veya
          bağlantısı yoktur.</li>
        <li>Girdiğiniz verilerin doğruluğundan siz sorumlusunuz. Analizler bilgilendirme amaçlıdır.</li>
        <li>Tüm paylaşım işlemlerini ilgili platformların kendi uygulamalarında, kendi sorumluluğunuzda
          gerçekleştirirsiniz. İlgili platformların kullanım koşullarına uymak sizin sorumluluğunuzdadır.</li>
      </ul>

      <h2>Hesabınız</h2>
      <p>
        Apple veya Google hesabınızla giriş yaparsınız. Hesap güvenliğiniz sizin sorumluluğunuzdadır.
        Hizmeti yasa dışı veya kötüye kullanım amacıyla kullanamazsınız.
      </p>

      <h2>Ücretlendirme</h2>
      <p>
        Ücretli özellikler sunulması hâlinde, iOS uygulamasındaki satın alımlar yalnızca Apple App
        Store üzerinden (Apple In-App Purchase) gerçekleştirilir.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu koşulları zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yayımlanır.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için: <a href="mailto:destek@realvirtuality.app">destek@realvirtuality.app</a>
      </p>
    </main>
  )
}
