import Jumbotron from "@/components/layouts/jumbotron";
import CustomerReview from "@/components/layouts/review";
import AppTemplate from "@/components/templates/app-template";
import { Link, usePage } from "@inertiajs/react"; // Pastikan Link diimpor

import FaqLayout from "@/components/layouts/faqlayout";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_slug: string;
  expired_at: string;
  stock?: number;
}

const Menu = () => {
  type PageProps = {
    items: Item[];
    search: string;
    total: number;
  };

  const { items, search, total } = usePage<PageProps>().props;
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

      <main className="mx-16">
        <div id="hero-section">
          <div id="nav" className="mt-10 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Up to -100%🎊RB Store exclusive deals</h1>
          </div>

          <div className="mt-6 flex gap-2.5 overflow-auto">
            {/* VOUCHER 1: Diskon 5% PEMBELIAN PERTAMA */}
            <Link href="/menu#vouchers-section" className="relative h-60 w-full rounded-2xl bg-[url('/img/dadar-gulung.png')] bg-cover bg-center">
              <h1 className="pt-44 pl-10 text-[#51793E]">Diskon 5%</h1>
              <p className="pl-10 text-2xl font-bold text-white">PEMBELIAN PERTAMA</p>
              <div className="absolute top-0 right-4 flex h-14 w-20 items-center justify-center rounded-b-2xl bg-black font-bold text-white">
                -5%
              </div>
            </Link>
            {/* VOUCHER 2: Diskon 10% MINIMAL BELI 20 ITEM */}
            <Link href="/menu#vouchers-section" className="relative h-60 w-full rounded-2xl bg-[url('/img/es-teler.png')] bg-cover bg-center">
              <h1 className="pt-44 pl-10 text-[#51793E]">Diskon 10% </h1>
              <p className="pl-10 text-2xl font-bold text-white">MINIMAL BELI 20 ITEM</p>
              <div className="absolute top-0 right-4 flex h-14 w-20 items-center justify-center rounded-b-2xl bg-black font-bold text-white">
                -10%
              </div>
            </Link>
            {/* VOUCHER 3: Gratis Sagu Mutiara PEMBELIAN 3 PIE */}
            <Link href="/menu#vouchers-section" className="relative h-60 w-full rounded-2xl bg-[url('/img/sagu-mutiara.png')] bg-cover bg-center">
              <h1 className="pt-44 pl-10 text-[#51793E]">Gratis Sagu Mutiara</h1>
              <p className="pl-10 text-2xl font-bold text-white">PEMBELIAN 3 PIE</p>
              <div className="absolute top-0 right-4 flex h-14 w-20 items-center justify-center rounded-b-2xl bg-black font-bold text-white">
                -100%
              </div>
            </Link>
          </div>
        </div>
      </main>
      {/* RB Store paling populer section */}
      <div className="mx-16 mt-16 text-black">
        <h2 className="text-2xl font-bold mb-8">RB Store paling populer! 😋</h2>

        <div className="grid grid-cols-6 gap-6">
          <Link href="/menu/kue-basah" className="flex flex-col items-center hover:opacity-90 transition">
            <div className="w-50 h-50 rounded-2xl bg-[url('/img/categories/kue-basah.png')] bg-cover bg-center mb-3"></div>
            <p className="text-md font-medium text-center">Kue Basah</p>
          </Link>

          <Link href="/menu/kue-kering" className="flex flex-col items-center hover:opacity-90 transition">
            <div className="w-50 h-50 rounded-2xl bg-[url('/img/categories/kue-kering.png')] bg-cover bg-center mb-3"></div>
            <p className="text-md font-medium text-center">Kue Kering</p>
          </Link>

          <Link href="/menu/kue-modern" className="flex flex-col items-center hover:opacity-90 transition">
            <div className="w-50 h-50 rounded-2xl bg-[url('/img/categories/kue-modern.png')] bg-cover bg-center mb-3"></div>
            <p className="text-md font-medium text-center">Kue Modern</p>
          </Link>

          <Link href="/menu/gorengan" className="flex flex-col items-center hover:opacity-90 transition">
            <div className="w-50 h-50 rounded-2xl bg-[url('/img/categories/gorengan.png')] bg-cover bg-center mb-3"></div>
            <p className="text-md font-medium text-center">Gorengan</p>
          </Link>

          <Link href="/menu/minuman" className="flex flex-col items-center hover:opacity-90 transition">
            <div className="w-50 h-50 rounded-2xl bg-[url('/img/categories/minuman.png')] bg-cover bg-center mb-3"></div>
            <p className="text-md font-medium text-center">Minuman</p>
          </Link>

          <Link href="/menu/puding" className="flex flex-col items-center hover:opacity-90 transition">
            <div className="w-50 h-50 rounded-2xl bg-[url('/img/categories/puding.png')] bg-cover bg-center mb-3"></div>
            <p className="text-md font-medium text-center">Puding</p>
          </Link>
        </div>
      </div>


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