import { useState } from 'react';

interface FaqQuestion {
  id: number;
  title: string;
  questions: string[];
  bgColor: string;
  textColor: string;
}

interface FeatureCard {
  id: number;
  content: {
    emoji: string;
    title: string;
    description: string;
    bgColor: string;
    textColor?: string;
  }
}

type FaqContent = FaqQuestion | FeatureCard;

interface TabContent {
  faq: FaqContent[];
  about: FaqContent[];
  help: FaqContent[];
}

interface FaqProps {
  className?: string;
}

export default function FaqLayout({ className = "" }: FaqProps) {
  const [activeTab, setActiveTab] = useState('faq');

  const tabs = [
    { id: 'faq', label: 'Pertanyaan Populer' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'help', label: 'Pusat Bantuan' }
  ];

  const tabContent: TabContent = {
    faq: [
      {
        id: 1,
        title: 'Cara pesan di RB Store? Simak caranya!',
        questions: [
          'Metode pembayaran apa yang bisa dipakai?',
          'Kapan dan bagaimana aku bisa lacak pesananku?',
          'Ada promo spesial? Yuk, dapatkan diskonmu!',
          'Apakah ada minimal order untuk setiap pemesanan?'
        ],
        bgColor: 'bg-[#51793E]',
        textColor: 'text-white'
      },
      {
        id: 2,
        content: {
          emoji: '🤝',
          title: 'Pesan Dalam Hitungan Detik!',
          description: 'Cukup kunjungi website kami untuk pesan kue favoritmu.',
          bgColor: 'bg-yellow-400'
        }
      }
    ],
    about: [
      {
        id: 1,
        title: 'Tentang RB Store',
        questions: [
          'Siapa kami?',
          'Visi dan Misi',
          'Mengapa memilih kami?',
          'Lokasi toko kami'
        ],
        bgColor: 'bg-blue-500',
        textColor: 'text-white'
      }
    ],
    help: [
      {
        id: 1,
        title: 'Bantuan Penggunaan',
        questions: [
          'Cara membuat akun',
          'Cara melakukan pemesanan',
          'Cara melacak pesanan',
          'Cara pembayaran'
        ],
        bgColor: 'bg-green-500',
        textColor: 'text-white'
      }
    ]
  };

  const currentContent = tabContent[activeTab as keyof TabContent];

  return (
    <div className={`mx-16 mt-20 bg-gray-50 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Kenali Kelezatan dalam Genggaman!</h2>
        <div className="flex justify-center gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#51793E] text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {currentContent.map(item => (
          <div key={item.id} className="text-center">
            {'questions' in item ? (
              <div className={`${item.bgColor} rounded-2xl p-6 mb-4 h-full`}>
                <h3 className={`${item.textColor} font-bold mb-4`}>{item.title}</h3>
                {item.questions.map((question, index) => (
                  <p key={index} className={`${item.textColor} text-sm ${index > 0 ? 'mt-3' : ''}`}>
                    {question}
                  </p>
                ))}
              </div>
            ) : (
              <div className={`${item.content.bgColor} rounded-2xl p-6 mb-4 flex flex-col items-center h-full`}>
                <div className="text-6xl mb-4">{item.content.emoji}</div>
                <h3 className={`font-bold mb-3 ${item.content.textColor || ''}`}>
                  {item.content.title}
                </h3>
                <p className={`text-sm ${item.content.textColor || ''}`}>
                  {item.content.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}