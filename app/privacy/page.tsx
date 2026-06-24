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
      <p className={s.meta}>Son güncelleme: 24 Haziran 2026</p>

      <p>
        Social Panel (&quot;uygulama&quot;), sosyal medya hesaplarınızın takipçi ve etkileşim
        verilerini tek bir yerde izlemenizi sağlar. Gizliliğinize saygı duyuyoruz ve yalnızca
        hizmeti sunmak için gereken en az veriyi işliyoruz.
      </p>

      <p>
        Uygulamayı <strong>girişsiz</strong> (yalnızca cihazınızda, herhangi bir kişisel veri
        toplamadan) kullanabilir veya telefon numaranızla giriş yaparak verilerinizi cihazlarınız
        arasında senkronlayabilirsiniz.
      </p>

      <h2>Topladığımız Veriler</h2>
      <ul>
        <li><strong>Telefon numarası:</strong> Yalnızca SMS ile giriş yapmayı seçerseniz, kimliğinizi
          doğrulamak ve hesabınızı oluşturmak için telefon numaranız işlenir. Girişsiz kullanımda
          telefon numarası toplanmaz.</li>
        <li><strong>Takip ettiğiniz hesaplar:</strong> Eklediğiniz sosyal medya platformu ve
          kullanıcı adları.</li>
        <li><strong>Metrik anlık görüntüleri:</strong> Elle girdiğiniz ya da yalnızca herkese açık
          resmî public API&apos;lerden çekilen takipçi, takip ve gönderi sayıları ile bunların
          tarihleri.</li>
        <li><strong>Yapay zekâ girdileri:</strong> AI sohbet veya üretim araçlarını kullanırsanız,
          gönderdiğiniz istemler (prompt) yanıt üretmek için AI sağlayıcısına iletilir.</li>
      </ul>
      <p>
        Şifrenizi, sosyal medya hesaplarınızın oturum bilgilerini veya kişisel mesajlarınızı
        <strong> toplamayız ve saklamayız</strong>. Uygulama, sosyal medya hesaplarınıza giriş yapmaz,
        sizin adınıza otomatik işlem yapmaz ve veri kazıma (scraping) kullanmaz.
      </p>

      <h2>Verilerin Saklanması</h2>
      <p>
        Verileriniz, kendi altyapımızda barındırılan Supabase (PostgreSQL) veritabanında, satır
        düzeyinde güvenlik (RLS) ile yalnızca size erişilebilir biçimde, şifreli bağlantı (TLS)
        üzerinden saklanır. Her kullanıcı yalnızca kendi verisini görür.
      </p>

      <h2>Üçüncü Taraf Hizmetler</h2>
      <p>
        Verilerinizi üçüncü taraflara <strong>satmaz, kiralamaz veya pazarlama amacıyla paylaşmayız</strong>.
        Hizmeti sunabilmek için yalnızca aşağıdaki sağlayıcılardan yararlanırız:
      </p>
      <ul>
        <li><strong>Twilio:</strong> SMS doğrulama kodunu göndermek için telefon numaranız işlenir.</li>
        <li><strong>Yapay zekâ sağlayıcısı:</strong> AI özelliklerini kullanırsanız istemleriniz yanıt
          üretmek için ilgili sağlayıcıya iletilir.</li>
        <li><strong>Apple / Google:</strong> Yalnızca uygulama içi satın alma (abonelik) işlemleri için.</li>
        <li><strong>Sosyal medya platformlarının resmî public API&apos;leri:</strong> Yalnızca herkese
          açık takipçi/gönderi sayılarını çekmek için (kimlik doğrulama gerektirmez).</li>
      </ul>
      <p>
        Bu sağlayıcılar verilerinizi yalnızca ilgili işlemi gerçekleştirmek için işler ve kendi gizlilik
        politikalarına tabidir.
      </p>

      <h2>Yapay Zekâ ve Verileriniz</h2>
      <p>
        AI sohbet ve üretim araçlarına girdiğiniz istemler yanıt üretmek için işlenir. Bu araçlara hassas
        kişisel verilerinizi girmemenizi öneririz. Ürettiğiniz içeriklerden ve bunların kullanımından
        siz sorumlusunuz (bkz. Kullanım Koşulları).
      </p>

      <h2>Veri Silme</h2>
      <p>
        Hesabınızı ve tüm ilişkili verilerinizi (telefon numaranız dâhil) dilediğiniz zaman
        <strong> uygulama içinden &quot;Hesabı Sil&quot;</strong> seçeneğiyle kalıcı olarak silebilirsiniz;
        silme işlemi anında gerçekleşir. Alternatif olarak{' '}
        <a href="mailto:daclen10@icloud.com">daclen10@icloud.com</a> adresine yazabilirsiniz; talebiniz
        en geç 30 gün içinde işlenir. Girişsiz kullanımda verileriniz yalnızca cihazınızda tutulur;
        uygulamayı silmeniz veya &quot;Tüm Verileri Sil&quot; seçeneği bunları kaldırır.
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
        Sorularınız için: <a href="mailto:daclen10@icloud.com">daclen10@icloud.com</a>
      </p>
    </main>
  )
}
