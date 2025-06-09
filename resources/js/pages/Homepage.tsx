import Jumbotron from "@/components/layouts/jumbotron";
import CustomerReview from "@/components/layouts/review";
import AppTemplate from "@/components/templates/app-template";
import { Link, usePage } from "@inertiajs/react";

import FaqLayout from "@/components/layouts/faqlayout";

interface Item {
  id: number;
  name: string;           // Changed from 'nama'
  description: string;    // Changed from 'deskripsi'
  price: number;         // Changed from 'harga'
  image_url: string;     // Changed from 'gambar_url'
  category_slug: string;
  expired_at: string;
  stock?: number;
}

const Menu = () => {
  const { items, search, total } = usePage().props as { 
    items: Item[], 
    search: string,
    total: number 
  };

  console.log('Search Results:', { items, search, total });

  return (
    <AppTemplate className="bg-[#FFFFFF]">
      <Jumbotron />
      
      {/* Search Results Section */}
      {search && (
        <div id="search-results" className="mx-16 mt-8 text-black">
          <h2 className="text-2xl font-bold mb-6">
            Hasil pencarian untuk "{search}" ({total || 0} hasil)
          </h2>
          
          {items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image Section */}
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/img/placeholder.png'; // Fallback image
                        target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center">
                      <span className="text-gray-400">Tidak ada gambar</span>
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-[#51793E] font-bold text-lg">
                        Rp {item.price?.toLocaleString('id-ID')}
                      </span>
                      <button 
                        className="px-4 py-2 bg-[#51793E] text-white rounded-full text-sm 
                                 hover:bg-[#3f5e30] transition-colors duration-300"
                      >
                        Pesan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">
                Tidak ada hasil untuk pencarian "{search}"
              </p>
              <Link
                href="/"
                className="inline-block mt-4 px-6 py-2 bg-[#51793E] text-white 
                         rounded-full text-sm hover:bg-[#3f5e30] transition-colors"
              >
                Cari Lagi
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* RB Store paling populer section */}
      {/* <div className="mx-16 mt-16 text-black">
        <h2 className="text-2xl font-bold mb-8">RB Store paling populer! 😋</h2>
        
        <div className="grid grid-cols-6 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-[url('/img/kue-basah.png')] bg-cover bg-center mb-3"></div>
            <p className="text-sm font-medium text-center">Kue Basah</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-[url('/img/kue-kering.png')] bg-cover bg-center mb-3"></div>
            <p className="text-sm font-medium text-center">Kue Kering</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-[url('/img/kue-modern.png')] bg-cover bg-center mb-3"></div>
            <p className="text-sm font-medium text-center">Kue Modern</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-[url('/img/gorengan.png')] bg-cover bg-center mb-3"></div>
            <p className="text-sm font-medium text-center">Gorengan</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-[url('/img/minuman.png')] bg-cover bg-center mb-3"></div>
            <p className="text-sm font-medium text-center">Minuman</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-[url('/img/puding.png')] bg-cover bg-center mb-3"></div>
            <p className="text-sm font-medium text-center">Puding</p>
          </div>
        </div>
      </div> */}

      {/* Kenali Kelezatan section */}
      {/* Commented out original section
      <div className="mx-16 mt-20 bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Kenali Kelezatan dalam Genggaman!</h2>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-[#51793E] text-white rounded-full text-sm">
              Pertanyaan Populer
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-600 rounded-full text-sm">
              Tentang Kami
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-600 rounded-full text-sm">
              Pusat Bantuan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="bg-[#51793E] rounded-2xl p-6 mb-4">
              <h3 className="text-white font-bold mb-2">Cara pesan di RB Store? Simak caranya!</h3>
              <p className="text-white text-sm">
                Metode pembayaran apa yang bisa dipakai?
              </p>
              <p className="text-white text-sm mt-2">
                Kapan dan bagaimana aku bisa lacak pesananku?
              </p>
              <p className="text-white text-sm mt-2">
                Ada promo spesial? Yuk, dapatkan diskonmu!
              </p>
              <p className="text-white text-sm mt-2">
                Apakah ada minimal order untuk setiap pemesanan?
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-yellow-400 rounded-2xl p-6 mb-4 flex flex-col items-center">
              <div className="text-6xl mb-2">🤝</div>
              <h3 className="font-bold mb-2">Pesan Dalam Hitungan Detik!</h3>
              <p className="text-sm">
                Cukup kunjungi website kami untuk pesan kue favoritmu.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-blue-400 rounded-2xl p-6 mb-4 flex flex-col items-center">
              <div className="text-6xl mb-2">📱</div>
              <h3 className="font-bold mb-2 text-white">Semua pembayaran bisa!</h3>
              <p className="text-sm text-white">
                Nikmati pengalaman cepat dengan kualitas terjaga
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            RB Store menyediakan aneka kue tradisional Indonesia kualitas terjamin dengan 
            pesanan dengan mudah tanpa perlu keluar dari rumah. Berbagai pilihan dan opsi 
            terpercaya dan dengan pengalaman kuliner terlengkap di era kini yang lebih 
            sempurna jika dinikmati bersama keluarga.
          </p>
        </div>
      </div>
      */}
      
      {/* New FAQ Layout Component */}
      <FaqLayout />

      {/* Statistics section */}
      <div className="mx-16 mt-12 bg-[#51793E] rounded-2xl p-8 text-white">
        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold">79,900+</h3>
            <p className="text-lg">ulasan positif</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">1,457+</h3>
            <p className="text-lg">pesanan per hari</p>
          </div>
        </div>
      </div>
    </AppTemplate>
  );
};

export default Menu;