import type { Metadata } from 'next'
import Link from 'next/link'
import s from '../legal.module.css'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Social Panel gizlilik politikası — hangi verileri topladığımız ve nasıl koruduğumuz.',
}

export default function PrivacyPage() {
  return (
    <main className={s.wrap}>
      <Link href="/" className={s.back}>← Social Panel</Link>
      <h1>Gizlilik Politikası</h1>
      <p className={s.meta}>Son güncelleme: 17 Haziran 2026</p>

      <p>
        Social Panel (&quot;uygulama&quot;), sosyal medya hesaplarınızın takipçi ve etkileşim
        verilerini tek bir yerde izlemenizi sağlar. Gizliliğinize saygı duyuyoruz ve yalnızca
        hizmeti sunmak için gereken en az veriyi işliyoruz.
      </p>

      <h2>Topladığımız Veriler</h2>
      <ul>
        <li><strong>Hesap kimliği:</strong> Apple veya Google ile giriş yaptığınızda sağlanan
          kullanıcı kimliği ve (varsa) e-posta adresiniz.</li>
        <li><strong>Takip ettiğiniz hesaplar:</strong> Eklediğiniz sosyal medya platformu ve
          kullanıcı adları.</li>
        <li><strong>Metrik anlık görüntüleri:</strong> Elle girdiğiniz takipçi, takip ve gönderi
          sayıları ile bunların tarihleri.</li>
      </ul>
      <p>
        Şifrenizi, sosyal medya hesaplarınızın oturum bilgilerini veya kişisel mesajlarınızı
        <strong> toplamayız ve saklamayız</strong>. Uygulama, hesaplarınızda sizin adınıza otomatik
        işlem yapmaz.
      </p>

      <h2>Verilerin Saklanması</h2>
      <p>
        Verileriniz, kendi altyapımızda barındırılan Supabase (PostgreSQL) veritabanında, satır
        düzeyinde güvenlik (RLS) ile yalnızca size erişilebilir biçimde, şifreli bağlantı (TLS)
        üzerinden saklanır. Her kullanıcı yalnızca kendi verisini görür.
      </p>

      <h2>Üçüncü Taraflarla Paylaşım</h2>
      <p>
        Verilerinizi üçüncü taraflara satmaz, kiralamaz veya pazarlama amacıyla paylaşmayız.
        Yalnızca giriş doğrulaması için Apple ve Google&apos;ın kimlik hizmetleri kullanılır.
      </p>

      <h2>Veri Silme</h2>
      <p>
        Hesabınızı ve tüm ilişkili verilerinizi istediğiniz zaman silebilirsiniz. Silme talebi için{' '}
        <a href="mailto:privacy@realvirtuality.app">privacy@realvirtuality.app</a> adresine
        yazabilirsiniz; talebiniz en geç 30 gün içinde işlenir.
      </p>

      <h2>Çocukların Gizliliği</h2>
      <p>Uygulama 13 yaş altı çocuklara yönelik değildir ve bilerek bu yaş grubundan veri toplamaz.</p>

      <h2>Değişiklikler</h2>
      <p>
        Bu politikada değişiklik yaptığımızda bu sayfadaki tarihi güncelleriz. Önemli değişikliklerde
        uygulama içinde bilgilendirme yapılır.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için: <a href="mailto:privacy@realvirtuality.app">privacy@realvirtuality.app</a>
      </p>
    </main>
  )
}
