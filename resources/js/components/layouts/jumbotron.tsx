import { useState } from "react";
import { router } from "@inertiajs/react";
import TrackingCard from '../tracking-card';

interface JumbotronProps {
  filters?: {
    search?: string;
  };
}

export default function Jumbotron({ filters = {} }: JumbotronProps) {
  const [pencarian, setPencarian] = useState(filters?.search || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pencarian.trim()) {
      router.get("/", { 
        search: pencarian 
      }, {
        preserveState: true,
        preserveScroll: false, // Changed to false to allow scrolling
        onSuccess: () => {
          // Scroll to search results after the page updates
          setTimeout(() => {
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
              searchResults.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      });
    }
  };

  return (
    <section aria-label="jumbotron" className="relative mx-16 mt-3 h-[38rem] overflow-hidden rounded-2xl border bg-[#FBFBFB] text-black">
      <img src="/img/klepon.png" alt="gambar klepon" className="absolute top-[60%] left-[46%] z-10 translate-x-[-50%] translate-y-[-50%]" />
      <div className="absolute top-10 right-0 h-full w-[45%] rounded-tl-[45%] bg-[#51793E]"></div>

      <TrackingCard
        title="RB Store"
        time="now"
        messages={['order cepat dan mudah', 'Pesanan langsung diproses']}
        number={1}
        className="absolute top-30 right-30"
      />
      <TrackingCard
        title="RB Store"
        time="now"
        messages={['menerima banyak jenis pembayaran ✅', 'nikmati kemudahan bertransaksi']}
        number={2}
        className="absolute right-5 bottom-55"
      />
      <TrackingCard
        title="RB Store"
        time="now"
        messages={['jasa kirim tanpa bayar ongkir!', 'pengiriman bebas menuju alamat anda']}
        number={3}
        className="absolute right-20 bottom-10"
      />

      <div className="mt-10 ml-10 relative z-20 text-black">
        <p>Pesan aneka kue tradisional, kudapan siap saji dan penawaran spesial lainnya!</p>
        <h1 className="text-5xl font-bold">Cita Rasa Nusantara,</h1>
        <div className="text-5xl font-bold text-[#51793E]">
          <p>Tradisi dalam</p>
          <p>Genggaman</p>
        </div>
        <p className="mt-5">Temukan Kelezatan dalam menu kami</p>
        
        <form onSubmit={handleSearch} className="relative">
          <div className="relative mt-3 h-10 w-96">
            <input
              type="text"
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              placeholder="Kue"
              className="h-full w-full rounded-4xl border border-gray-500 px-4 py-2 font-bold"
              maxLength={25}
            />
            <button 
              type="submit" 
              className="absolute right-0 h-full rounded-4xl bg-[#51793E] px-10 py-2 font-bold text-white transition-colors hover:bg-[#3f5e30] disabled:opacity-50"
              disabled={!pencarian.trim()}
            >
              Cari
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
