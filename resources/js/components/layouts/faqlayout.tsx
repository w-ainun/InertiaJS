import { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm';       // Import remarkGfm for GitHub Flavored Markdown (e.g., lists)

// Add WhatsApp helper function
const openWhatsApp = (question: string) => {
  const phoneNumber = '6287889817650';
  const message = encodeURIComponent(`Halo, saya ingin bertanya tentang: ${question}`);
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
};

// --- TIPE DATA BARU UNTUK JAWABAN (Mirip dengan FeatureCard.content) ---
interface AnswerContent {
  id: number;
  imageSrc?: string;
  title: string;
  description: string;
  bgColor: string;
  textColor?: string;
  showPlusIcon?: boolean;
}

interface FaqQuestion {
  id: number;
  title: string;
  questions: {
    text: string;
    answerId: number; // Menunjuk ke ID jawaban
  }[];
  bgColor: string;
  textColor: string;
}

interface FeatureCard {
  id: number;
  content: {
    imageSrc?: string;
    title: string;
    description: string;
    bgColor: string;
    textColor?: string;
    showPlusIcon?: boolean;
  };
}

// FaqContentItem bisa jadi FaqQuestion atau FeatureCard
type FaqContentItem = FaqQuestion | FeatureCard;

interface TabContent {
  faq: FaqContentItem[]; // Akan berisi FaqQuestion DAN FeatureCard
  about: FeatureCard[];
  help: FeatureCard[];
}

interface FaqProps {
  className?: string;
}

export default function FaqLayout({ className = "" }: FaqProps) {
  const [activeTab, setActiveTab] = useState('faq');
  // State untuk menyimpan jawaban yang aktif saat pertanyaan FAQ diklik
  const [activeAnswer, setActiveAnswer] = useState<AnswerContent | null>(null);

  const tabs = [
    { id: 'faq', label: 'Pertanyaan Populer' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'help', label: 'Pusat Bantuan' },
  ];

  const answers: AnswerContent[] = [
    {
      id: 101,
      title: 'Pembayaran Mudah & Fleksibel untuk Transaksi Anda',
      description: `Kami berkomitmen untuk menyediakan beragam pilihan pembayaran yang aman dan nyaman demi kelancaran transaksi Anda. Setelah Anda mengonfirmasi pesanan, Anda akan diarahkan ke halaman pembayaran yang terintegrasi, di mana Anda bisa memilih metode yang paling sesuai.

Berikut adalah pilihan pembayaran yang kami sediakan secara rinci:

**1. Transfer Bank Virtual Account (VA)**
Ini adalah metode pembayaran yang populer dan sangat fleksibel. Anda akan mendapatkan **nomor Virtual Account** unik untuk setiap transaksi, sehingga pembayaran Anda dapat teridentifikasi secara otomatis. Pembayaran dapat dilakukan melalui:
* **ATM**: Masukkan kartu, pilih menu transfer, lalu pilih Virtual Account dan masukkan nomor VA Anda.
* **Mobile Banking**: Akses aplikasi mobile banking Anda, pilih menu transfer/pembayaran, cari opsi Virtual Account atau pembayaran e-commerce, lalu masukkan nomor VA.
* **Internet Banking**: Login ke internet banking Anda, cari menu transfer/pembayaran Virtual Account, dan ikuti instruksi.

Bank-bank yang didukung untuk Virtual Account meliputi **BCA, Mandiri, BNI, BRI, Permata Bank**, dan bank-bank lainnya melalui jaringan **ATM Bersama/Prima**. Konfirmasi pembayaran akan otomatis setelah Anda berhasil melakukan transfer.

**2. E-Wallet Populer**
Bayar dengan cepat dan mudah menggunakan e-wallet favorit Anda. Cukup pindai kode QR atau ikuti instruksi di aplikasi e-wallet Anda. Metode ini sangat cocok bagi Anda yang mencari transaksi instan tanpa perlu repot memasukkan banyak data. E-wallet yang kami terima meliputi:
* **GoPay**: Lakukan pembayaran langsung dari aplikasi Gojek Anda.
* **OVO**: Bayar menggunakan saldo OVO Anda.
* **DANA**: Transaksi praktis via aplikasi DANA.
* **LinkAja**: Manfaatkan saldo LinkAja Anda untuk pembayaran.

**3. Kartu Kredit & Debit (Visa, Mastercard, JCB, Amex)**
Kami menerima pembayaran menggunakan **kartu kredit dan debit** berlogo **Visa, Mastercard, JCB**, dan **American Express (Amex)**. Transaksi kartu Anda dijamin aman dengan standar keamanan PCI DSS. Anda hanya perlu memasukkan detail kartu Anda (nomor kartu, tanggal kedaluwarsa, dan kode CVV) pada halaman pembayaran yang terenkripsi.

**4. Lainnya**
Selain metode di atas, kami juga menyediakan beberapa opsi pembayaran alternatif untuk kenyamanan Anda, seperti:
* **Gerai Retail (Indomaret/Alfamart)**: Anda bisa membayar tunai di gerai Indomaret atau Alfamart terdekat. Anda akan mendapatkan kode pembayaran yang perlu ditunjukkan kepada kasir.
* **QRIS**: Pindai kode QRIS kami menggunakan aplikasi pembayaran apa pun yang mendukung standar QRIS (misalnya GoPay, OVO, DANA, mobile banking).

Kami terus berupaya untuk memperluas pilihan pembayaran demi kenyamanan Anda. Jika Anda memiliki pertanyaan lebih lanjut mengenai proses pembayaran, jangan ragu untuk menghubungi layanan pelanggan kami!`,
      bgColor: 'bg-[#E6F3E6]',
      textColor: 'text-gray-800',
    },
    {
      id: 102,
      imageSrc: '/img/faq/tracking-order.png',
      title: 'Lacak Pesananmu Secara Real-time!',
      description: 'Setelah pesanan dikonfirmasi dan dikirim, Anda akan menerima nomor resi melalui email atau WhatsApp. Anda bisa melacak status pesanan Anda melalui tautan yang disediakan di website kami.',
      bgColor: 'bg-[#E6F3E6]',
      textColor: 'text-gray-800',
    },
    {
      id: 103,
      imageSrc: '/img/faq/discount.png',
      title: 'Diskon Menarik Menanti!',
      description: 'Ya, kami sering mengadakan promo spesial di momen tertentu atau untuk pembelian dalam jumlah tertentu. Pastikan Anda selalu mengecek bagian promosi di website kami atau ikuti media sosial kami untuk update terbaru!',
      bgColor: 'bg-[#E6F3E6]',
      textColor: 'text-gray-800',
    },
    {
      id: 104,
      imageSrc: '/img/faq/min-order.png',
      title: 'Tidak Ada Minimal Order!',
      description: 'Anda bisa memesan satu kue saja atau dalam jumlah banyak, tidak ada batasan minimal order untuk setiap pemesanan di RB Store. Pesan sesukamu!',
      bgColor: 'bg-[#E6F3E6]',
      textColor: 'text-gray-800',
    },
  ];

  const tabContent: TabContent = {
    faq: [
      {
        id: 1,
        title: 'cara pesan di RB store? Simak caranya!',
        questions: [
          { text: 'Metode pembayaran apa yang bisa dipakai?', answerId: 101 },
          { text: 'Kapan dan bagaimana aku bisa lacak pesananku?', answerId: 102 },
          { text: 'Ada promo spesial? Yuk, dapatkan diskonmu!', answerId: 103 },
          { text: 'Apakah ada minimal order untuk setiap pemesanan?', answerId: 104 },
        ],
        bgColor: 'bg-[#51793E]',
        textColor: 'text-white',
      },
      // --- FEATURE CARD TETAP DI SINI ---
      {
        id: 2,
        content: {
          imageSrc: '/img/faq/order-food 1.png',
          title: 'Pesan Dalam Hitungan Detik!',
          description: 'Cukup kunjungi website kami untuk pesan kue favoritmu',
          bgColor: 'bg-[#E6F3E6]',
          textColor: 'text-gray-800',
        },
      },
      {
        id: 3,
        content: {
          imageSrc: '/img/faq/food 1.png',
          title: 'Dikirim Gratis Tanpa Biaya',
          description: 'Nikmati pengiriman cepat dengan kualitas terjaga',
          bgColor: 'bg-[#E6F3E6]',
          textColor: 'text-gray-800',
        },
      },
      {
        id: 4,
        content: {
          imageSrc: '/img/faq/order 1.png',
          title: 'Semua Pembayaran? Bisa!',
          description: 'Pembayaran fleksibel, gak perlu ribet!',
          bgColor: 'bg-[#E6F3E6]',
          textColor: 'text-gray-800',
        },
      },
    ],
    about: [
      {
        id: 1,
        content: {
            title: 'Visi Kami: Hadirkan Kebahagiaan',
            description: 'Menjadi toko kue online pilihan utama, menyajikan kebahagiaan melalui cita rasa yang tak terlupakan dan pengalaman pemesanan yang mudah.',
            bgColor: 'bg-[#51793E]',
            textColor: 'text-white',
        }
      },
      {
        id: 2,
        content: {
          title: 'Perjalanan RB Store',
          description: 'Berawal dari hobi membuat kue rumahan, kini kami berdedikasi menyajikan aneka kue lezat dengan bahan pilihan terbaik untuk Anda.',
          bgColor: 'bg-[#E6F3E6]',
          textColor: 'text-gray-800',
        },
      },
      {
        id: 3,
        content: {
          title: 'Kualitas Prioritas Utama',
          description: 'Setiap kue dibuat dengan cinta, menggunakan bahan-bahan segar berkualitas tinggi dan standar kebersihan terjamin.',
          bgColor: 'bg-[#51793E]',
          textColor: 'text-white',
        },
      },
      {
        id: 4,
        content: {
          title: 'Pengiriman Cepat & Aman',
          description: 'Layanan pengiriman kami memastikan kue pesanan Anda sampai tujuan dengan cepat dan tetap utuh dalam kondisi prima.',
          bgColor: 'bg-[#E6F3E6]',
          textColor: 'text-gray-800',
        },
      },
    ],
    help: [
      {
        id: 1,
        content: {
            title: 'Bantuan Penggunaan',
            description: 'anda bisa menghubungi untuk bantuan yang lebih lanjut.',
            bgColor: 'bg-[#51793E]',
            textColor: 'text-white',
        }
      },
      {
        id: 2,
        content: {
          imageSrc: '/img/faq/telepon.png',
          title: 'Layanan Telepon',
          description: 'Hubungi kami di 0857-3533-9148. (Senin-Jumat, 09:00 - 17:00 WIB) untuk bantuan langsung.',
          bgColor: 'bg-[#E6F3E6]',
          textColor: 'text-gray-800',
        },
      },
      {
        id: 3,
        content: {
          imageSrc: '/img/faq/whatsapp.png',
          title: 'Dukungan WhatsApp',
          description: 'Kirim pesan ke 0857-3533-9148. Kami akan segera merespons pertanyaan Anda.',
          bgColor: 'bg-[#E6F3E6]',
          textColor: 'text-gray-800',
        },
      },
      {
        id: 4,
        content: {
          imageSrc: '/img/faq/email.png',
          title: 'Kirim Kami Email',
          description: 'Untuk pertanyaan detail atau non-urgent, kirim email ke ronibakerystore@gmail.com. Kami akan balas dalam 1x24 jam kerja.',
          bgColor: 'bg-[#E6F3E6]',
          textColor: 'text-gray-800',
        },
      },
    ],
  };

  const currentContent = tabContent[activeTab as keyof TabContent];

  const getLinkHref = (title: string): string => {
    if (title === 'Layanan Telepon') {
      return 'tel:+6285735339148';
    } else if (title === 'Dukungan WhatsApp') {
      return 'https://wa.me/6285735339148';
    } else if (title === 'Kirim Kami Email') {
      const recipient = 'ronibakerystore@gmail.com';
      const subject = encodeURIComponent('Pertanyaan dari Website RB Store');
      const body = encodeURIComponent('Halo, saya ingin bertanya tentang...');
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    }
    return '#';
  };

  const handleFaqQuestionClick = (answerId: number) => {
    const foundAnswer = answers.find(ans => ans.id === answerId);
    if (foundAnswer) {
      setActiveAnswer(foundAnswer);
    }
  };

  
  const renderGridContent = () => {
    if (activeTab === 'faq') {
      const faqQuestionBlock = currentContent.find(item => 'questions' in item);
      const initialFeatureCards = currentContent.filter(item => 'content' in item) as FeatureCard[];

      return (
        <>
          {/* Kolom FaqQuestion */}
          {faqQuestionBlock && 'questions' in faqQuestionBlock && (
            <div key={faqQuestionBlock.id} className="text-left">
              <div className={`${faqQuestionBlock.bgColor} rounded-2xl p-6 mb-4 h-full`}>
                <h3 className={`${faqQuestionBlock.textColor} font-bold mb-4`}>
                  {faqQuestionBlock.title}
                </h3>
                {faqQuestionBlock.questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleFaqQuestionClick(question.answerId)}
                    className={`
                      ${faqQuestionBlock.textColor} text-sm ${index > 0 ? 'mt-3' : ''}
                      w-full text-left hover:opacity-80 transition-opacity
                    `}
                  >
                    <span>{question.text}</span>
                    <span className="text-xs">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Kolom untuk Menampilkan Jawaban atau FeatureCard Default */}
          {activeAnswer ? (
            // Jika ada jawaban aktif, tampilkan jawaban
            <div className="md:col-span-3 text-left"> {/* Menempati 3 kolom sisanya */}
              <div className={`${activeAnswer.bgColor} rounded-2xl p-6 mb-4 flex flex-col items-start h-full relative`}>
                {activeAnswer.imageSrc && (
                  <img
                    src={activeAnswer.imageSrc}
                    alt={activeAnswer.title}
                    className="w-50 h-50 mb-4" // Sesuaikan ukuran gambar jika perlu (misal: w-64 h-auto)
                  />
                )}
                <h3 className={`font-bold mb-3 text-left ${activeAnswer.textColor || ''}`}>
                  {activeAnswer.title}
                </h3>
                {/* Render deskripsi menggunakan ReactMarkdown */}
                <div className={`text-sm text-left ${activeAnswer.textColor || ''} prose max-w-none`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeAnswer.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            initialFeatureCards.map(item => (
              <div key={item.id} className="text-left">
                <div className={`${item.content.bgColor} rounded-2xl p-6 mb-4 flex flex-col items-center h-full relative`}>
                  {item.content.showPlusIcon && (
                    <div className="absolute top-4 right-4 bg-[#51793E] rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                )}
                {item.content.imageSrc && (
                  <img
                    src={item.content.imageSrc}
                    alt={item.content.title}
                    className="w-50 h-50 mb-4"
                  />
                )}
                <h3 className={`font-bold mb-3 text-center ${item.content.textColor || ''}`}>
                  {item.content.title}
                </h3>
                <p className={`text-sm text-center ${item.content.textColor || ''}`}>
                  {item.content.description}
                </p>
              </div>
              </div>
            ))
          )}
        </>
      );
    } else {
      return currentContent.map((item) => (
        'content' in item && (
          <div key={item.id} className="text-left">
            <a
              href={activeTab === 'help' ? getLinkHref(item.content.title) : '#'}
              target={activeTab === 'help' && item.content.title !== 'Layanan Telepon' ? '_blank' : '_self'}
              rel={activeTab === 'help' && item.content.title !== 'Layanan Telepon' ? 'noopener noreferrer' : ''}
              className="block h-full"
            >
              <div className={`${item.content.bgColor} rounded-2xl p-6 mb-4 flex flex-col items-center h-full relative`}>
                {item.content.showPlusIcon && (
                  <div className="absolute top-4 right-4 bg-[#51793E] rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                )}
                {item.content.imageSrc && (
                  <img
                    src={item.content.imageSrc}
                    alt={item.content.title}
                    className="w-50 h-50 mb-4"
                  />
                )}
                <h3 className={`font-bold mb-3 text-center ${item.content.textColor || ''}`}>
                  {item.content.title}
                </h3>
                <p className={`text-sm text-center ${item.content.textColor || ''}`}>
                  {item.content.description}
                </p>
              </div>
            </a>
          </div>
        )
      ));
    }
  };

  return (
    <div className={`mx-auto mt-20 bg-white rounded-2xl p-8 max-w-7xl ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Kenali Kelezatan dalam Genggaman!
        </h2>
        <div className="flex justify-center gap-4 border border-gray-200 rounded-full p-1 w-fit mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveAnswer(null); // Reset jawaban aktif saat tab berubah
              }}
              className={`
                px-6 py-2 rounded-full text-sm transition-colors
                ${activeTab === tab.id ? 'bg-[#51793E] text-white' : 'text-gray-600 hover:bg-[#E6F3E6]'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {renderGridContent()} {/* Panggil fungsi renderGridContent di sini */}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-2 text-gray-800"></h2>
      </div>
    </div>
  );
}