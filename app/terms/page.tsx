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
      <p className={s.meta}>Son güncelleme: 24 Haziran 2026</p>

      <p>
        Social Panel&apos;i kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Lütfen dikkatlice
        okuyun.
      </p>

      <h2>Hizmetin Tanımı</h2>
      <p>
        Social Panel, birden çok sosyal medya hesabınızın takipçi ve etkileşim metriklerini kaydedip
        görselleştirmenizi sağlayan bir izleme ve analiz aracıdır. Bazı platformlarda, yalnızca herkese
        açık ve giriş gerektirmeyen <strong>resmî public API&apos;ler</strong> üzerinden takipçi/gönderi gibi
        kamuya açık sayıları otomatik olarak çekebilir; diğer platformlarda verileri elle girersiniz.
        Uygulama, sosyal medya hesaplarınıza giriş yapmaz, şifrenizi istemez ve sizin adınıza paylaşım,
        takip veya başka bir otomatik işlem yapmaz; herhangi bir veri kazıma (scraping) yöntemi kullanmaz.
      </p>

      <h2>Sorumluluk Reddi</h2>
      <ul>
        <li>Uygulama, sosyal medya platformlarının resmî bir ürünü değildir; onlarla ortaklığı veya
          bağlantısı yoktur.</li>
        <li>Girdiğiniz verilerin doğruluğundan siz sorumlusunuz. Analizler bilgilendirme amaçlıdır.</li>
        <li>Tüm paylaşım işlemlerini ilgili platformların kendi uygulamalarında, kendi sorumluluğunuzda
          gerçekleştirirsiniz. İlgili platformların kullanım koşullarına uymak sizin sorumluluğunuzdadır.</li>
      </ul>

      <h2>Hesabınız ve Giriş</h2>
      <p>
        Uygulamayı girişsiz (yalnızca cihazınızda) kullanabilir veya telefon numaranızla SMS doğrulaması
        yaparak hesabınızı oluşturup verilerinizi cihazlarınız arasında senkronlayabilirsiniz. Telefon
        numaranızın size ait olduğunu ve doğru olduğunu beyan edersiniz. Hesap güvenliğiniz sizin
        sorumluluğunuzdadır. Hesabınızı ve tüm verilerinizi dilediğiniz zaman uygulama içinden kalıcı
        olarak silebilirsiniz. Hizmeti yasa dışı veya kötüye kullanım amacıyla kullanamazsınız.
      </p>

      <h2>Yapay Zekâ (AI) Araçları</h2>
      <p>
        Uygulama; sohbet asistanı ile metin, görsel ve video üretim araçları gibi yapay zekâ destekli
        özellikler sunabilir. Bu özellikleri kullanırken aşağıdaki koşulları kabul edersiniz:
      </p>
      <ul>
        <li><strong>Tüm sorumluluk kullanıcıya aittir.</strong> AI araçlarına girdiğiniz istemlerden
          (prompt) ve ürettiğiniz/indirdiğiniz/paylaştığınız her türlü içerikten yalnızca siz
          sorumlusunuz. Bu içerikleri kullanmanızın hukuki sonuçları size aittir.</li>
        <li>AI çıktıları otomatik olarak üretilir; <strong>doğru, eksiksiz, güncel veya belirli bir amaca
          uygun olduğu garanti edilmez.</strong> Çıktılar tavsiye niteliğinde değildir; doğrulamak sizin
          sorumluluğunuzdadır.</li>
        <li>AI ile; yasa dışı, telif hakkı veya fikrî mülkiyet ihlali içeren, başkasının kişilik/marka
          haklarını çiğneyen, nefret söylemi, taciz, müstehcen/yasak, yanıltıcı (deepfake dâhil) veya
          üçüncü kişileri yanıltacak içerikler üretmemeyi kabul edersiniz.</li>
        <li>Ürettiğiniz içeriğin üçüncü kişilerin haklarını ihlal etmediğinden ve ilgili platform ile
          yasal mevzuata uygun olduğundan emin olmak sizin yükümlülüğünüzdür.</li>
        <li>AI özellikleri üçüncü taraf sağlayıcılar aracılığıyla sunulabilir ve ilgili sağlayıcının
          kullanım koşulları da geçerli olabilir. Bu özellikleri önceden bildirimde bulunmaksızın
          değiştirebilir, sınırlayabilir veya durdurabiliriz.</li>
      </ul>
      <p>
        Social Panel, kullanıcıların AI araçlarıyla ürettiği içeriklerden veya bu içeriklerin
        kullanımından doğan hiçbir zarardan, talepten veya hukuki sorumluluktan mesul değildir.
      </p>

      <h2>Kabul Edilebilir Kullanım</h2>
      <ul>
        <li>Hizmeti yürürlükteki yasalara aykırı hiçbir amaçla kullanamazsınız.</li>
        <li>Üçüncü kişilerin gizlilik, telif, marka veya kişilik haklarını ihlal edemezsiniz.</li>
        <li>Sosyal medya platformlarının kullanım koşullarına uymak ve verilerinizi yasal yollarla elde
          etmek sizin sorumluluğunuzdadır.</li>
        <li>Hizmete, sistemlerine veya başka kullanıcıların verilerine yetkisiz erişim sağlamaya veya
          hizmeti bozmaya çalışamazsınız.</li>
      </ul>

      <h2>Ücretlendirme ve Abonelikler</h2>
      <p>
        Bazı özellikler ücretli abonelikle sunulabilir. iOS uygulamasındaki satın alımlar yalnızca
        Apple App Store üzerinden (Apple In-App Purchase), Android uygulamasındaki satın alımlar Google
        Play üzerinden gerçekleştirilir. Aboneliğiniz, mevcut dönem bitiminden en az 24 saat önce iptal
        edilmediği takdirde otomatik olarak yenilenir ve ödeme ilgili mağaza hesabınıza işlenir.
        Aboneliklerinizi dilediğiniz zaman ilgili mağaza ayarlarından yönetebilir veya iptal edebilirsiniz.
      </p>

      <h2>Garanti Reddi</h2>
      <p>
        Hizmet &quot;olduğu gibi&quot; ve &quot;mevcut hâliyle&quot; sunulur. Hizmetin kesintisiz, hatasız
        veya belirli bir amaca uygun olacağına dair açık ya da zımni hiçbir garanti verilmez. Hizmeti
        kullanmak tamamen sizin tercihiniz ve riskinizdedir.
      </p>

      <h2>Sorumluluğun Sınırlandırılması</h2>
      <p>
        Yürürlükteki yasaların izin verdiği azami ölçüde; Social Panel ve geliştiricileri, hizmetin
        kullanımından veya kullanılamamasından, kullanıcı tarafından üretilen veya girilen içeriklerden,
        yapay zekâ çıktılarından ya da üçüncü taraf hizmet ve platformlardan doğan dolaylı, arızi, özel
        veya sonuç niteliğindeki hiçbir zarardan sorumlu tutulamaz. Kullanıcı, hizmeti kullanımıyla
        bağlantılı olarak üçüncü kişilerden gelebilecek taleplere karşı Social Panel&apos;i tazmin etmeyi
        ve beri kılmayı kabul eder.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu koşulları zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yayımlanır.
        Güncellemeden sonra hizmeti kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için: <a href="mailto:daclen10@icloud.com">daclen10@icloud.com</a>
      </p>
    </main>
  )
}
