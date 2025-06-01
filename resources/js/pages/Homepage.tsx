import Jumbotron from "@/components/layouts/jumbotron";
import CustomerReview from "@/components/layouts/review";
import AppTemplate from "@/components/templates/app-template";
import { Link } from "@inertiajs/react";

const Menu = () => {
  return (
    <AppTemplate className="bg-[#FFFFFF]">
      <Jumbotron />
      
      <form className="mx-16 mt-4">
        <input 
          type="text" 
          placeholder="Search For Menu.." 
          className="w-full rounded-full p-3 border" 
        />
      </form>

      <div id="hero-section" className="mx-16">
        <div id="nav" className="mt-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Diskon sampai 10% 🎊 penawaran terbaik RB Store!</h1>
          </div>

        <div className="mt-6 flex gap-2.5 overflow-auto">
          <div className="relative h-60 w-full rounded-2xl bg-[url('/img/dadar-gulung.png')] bg-cover bg-center">
            <h1 className="pt-44 pl-10 text-[#51793E]">Kue Basah</h1>
            <p className="pl-10 text-2xl font-bold text-white">Dadar Gulung</p>
            <div className="absolute top-0 right-4 flex h-14 w-20 items-center justify-center rounded-b-2xl bg-black font-bold text-white">
              -40%
            </div>
          </div>
          <div className="relative h-60 w-full rounded-2xl bg-[url('/img/cucur.png')] bg-cover bg-center">
            <h1 className="pt-44 pl-10 text-[#51793E]">Kue Basah</h1>
            <p className="pl-10 text-2xl font-bold text-white">Kue Cucur</p>
            <div className="absolute top-0 right-4 flex h-14 w-20 items-center justify-center rounded-b-2xl bg-black font-bold text-white">
              -40%
            </div>
          </div>
          <div className="relative h-60 w-full rounded-2xl bg-[url('/img/koci-koci.png')] bg-cover bg-center">
            <h1 className="pt-44 pl-10 text-[#51793E]">Kue Basah</h1>
            <p className="pl-10 text-2xl font-bold text-white">Koci-koci</p>
            <div className="absolute top-0 right-4 flex h-14 w-20 items-center justify-center rounded-b-2xl bg-black font-bold text-white">
              -40%
            </div>
          </div>
        </div>
      </div>

      {/* RB Store paling populer section */}
      <div className="mx-16 mt-16">
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
      </div>

      {/* Kenali Kelezatan section */}
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