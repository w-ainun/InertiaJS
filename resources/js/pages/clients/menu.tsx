import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppTemplate from "@/components/templates/app-template";
import CustomerReview from "@/components/layouts/review";
import KategoriJumbotron from "@/components/layouts/kategori-jumbotron";
import { ShoppingCart } from 'lucide-react'; // Plus tidak digunakan, bisa dihapus
import StoreMap from "@/components/layouts/StoreMap";

// Interface untuk Produk
interface Produk {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

// Interface untuk Kategori
interface Category {
  id: number;
  name: string;
  slug: string;
}

// Interface untuk Voucher
interface Voucher {
    id: number;
    code: string;
    description: string;
    // image_url: string | null; // Dihapus karena gambar diatur manual
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_purchase_amount: number;
    max_discount_amount: number | null;
    usage_limit: number | null;
    used_count: number;
    valid_from: string;
    valid_until: string;
}

// Props gabungan untuk halaman menu
interface MenuPageProps {
  categories: Category[];
  kategori?: string;
  produk?: Produk[];
  gambar?: string;
  notice?: string;
  currentSlugBeingDisplayed?: string;
  vouchers: Voucher[]; // Tetap ada, karena data voucher masih dikirim
}



// FUNGSI PEMBANTU UNTUK MENDAPATKAN URL GAMBAR VOUCHER SECARA MANUAL
const getVoucherImageUrl = (voucherCode: string): string => {
    switch (voucherCode) {
        case 'FIRSTORDER5':
            return '/img/dadar-gulung.png';
        case 'MIN20ITEM10':
            return '/img/es-teler.png';
        case 'FREESAGU':
            return '/img/sagu-mutiara.png';
        // Tambahkan case lain jika ada voucher baru dengan gambar spesifik
        default:
            return '/img/default-voucher.png'; // Gambar default jika kode tidak cocok
    }
};

export default function MenuPage({
  categories,
  kategori,
  produk,
  gambar,
  notice,
  currentSlugBeingDisplayed
}: MenuPageProps) {
  // Ambil vouchers dari usePage().props, pastikan tipe datanya sesuai
  const vouchers: Voucher[] = (usePage().props.vouchers ?? []) as Voucher[];

  const [itemQuantities, setItemQuantities] = useState<{ [key: number]: number }>({});

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('IDR', 'Rp ');
  };

  const handleQuantityChange = (itemId: number, newQuantityInput: string, itemStock: number) => {
    let quantity = parseInt(newQuantityInput, 10);

    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }
    if (itemStock > 0) {
        quantity = Math.min(quantity, itemStock);
    } else {
        quantity = 1;
    }

    setItemQuantities(prevQuantities => ({
        ...prevQuantities,
        [itemId]: quantity
    }));
  };

  const handleAddToCart = (item: Produk) => {
    const quantityToAdd = itemQuantities[item.id] || 1;

    if (item.stock === 0) {
        alert(`Maaf, ${item.name} sedang habis.`);
        return;
    }
    if (quantityToAdd > item.stock) {
        alert(`Stok ${item.name} tidak mencukupi. Maksimal pembelian ${item.stock} unit.`);
        setItemQuantities(prevQuantities => ({
            ...prevQuantities,
            [item.id]: item.stock
        }));
        return;
    }

    router.post(route('client.cart.add'), {
        item_id: item.id,
        quantity: quantityToAdd,
    }, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            const itemName = produk?.find(p => p.id === item.id)?.name || 'Item';
            alert(`${quantityToAdd} unit ${itemName} berhasil ditambahkan ke keranjang!`);
        },
        onError: (errors) => {
            console.error('Error adding item to cart:', errors);
            alert(`Gagal menambahkan ${item.name} ke keranjang. Stok mungkin tidak cukup atau terjadi kesalahan lain.`);
        }
    });
  };

  return (
    <AppTemplate className="bg-[#FFFFFF]">
      <Head title={kategori ? `Menu - ${kategori}` : "Menu"} />
      {kategori && gambar && notice && (
        <KategoriJumbotron
          judul={kategori}
          keterangan={notice}
          gambar={gambar}
        />
      )}

      <div className="mx-4 sm:mx-8 md:mx-16 mt-4">
        <form>
          <input type="text" placeholder="Cari menu..." className="w-full rounded-full p-3 border focus:ring-green-500 focus:border-green-500" />
        </form>
      </div>

      <nav aria-label="products navigation display">
        <ul className="flex flex-wrap justify-around p-3 mt-5 gap-3 bg-[#F3F3F3] text-lg md:text-xl font-bold">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/menu/${cat.slug}`}
                className={`text-black hover:bg-black hover:text-white px-3 py-1 md:px-5 rounded-full transition ${
                  currentSlugBeingDisplayed === cat.slug ? 'bg-black text-white' : ''
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

<main className="mx-16">
    <div id="hero-section">
      <div id="nav" className="mt-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Voucher Diskon RBStore</h1> {/* Ubah teks */}
      </div>

      <div id="vouchers-section" className="mt-6 flex gap-2.5 overflow-auto"> {/* TAMBAH ID INI */}
        {vouchers.length > 0 ? (
            vouchers.map((voucher) => (
                <div
                    key={voucher.id}
                    className="relative h-60 w-full rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url('${getVoucherImageUrl(voucher.code)}')` }}
                >
                    <div className="absolute inset-0 bg-opacity-40 rounded-2xl flex flex-col justify-end p-4">
                        <h1 className="text-[#51793E] text-lg font-bold">
                            {voucher.discount_type === 'percentage' ? `${voucher.discount_value}% Diskon` : formatCurrency(voucher.discount_value) + ' Diskon'}
                        </h1>
                        <p className="text-xl font-bold text-white mt-1">{voucher.description}</p>
                        {voucher.min_purchase_amount > 0 && (
                            <p className="text-sm text-gray-200 mt-1">
                                Min. Belanja: {formatCurrency(voucher.min_purchase_amount)}
                            </p>
                        )}
                        <div className="absolute top-0 right-4 flex h-14 w-20 items-center justify-center rounded-b-2xl bg-black font-bold text-white">
                            {voucher.discount_type === 'percentage' ? `-${voucher.discount_value}%` : 'Voucher'}
                        </div>
                        <Link
                            href={route('client.cart.index', { voucher_code: voucher.code })}
                            className="absolute bottom-4 right-4 px-4 py-2 bg-[#51793E] text-white rounded-full text-sm hover:bg-[#3f5e30] transition-colors"
                        >
                            Gunakan Voucher
                        </Link>
                    </div>
                </div>
            ))
        ) : (
            <div className="w-full text-center py-4 text-gray-500">
                Tidak ada voucher yang tersedia saat ini.
            </div>
        )}
      </div>
    </div>
</main>



      {kategori && produk && produk.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{kategori}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produk.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <img
                    src={item.image_url ? item.image_url : `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 flex-grow min-h-[40px]">{item.description}</p>
                  <p className="text-lg font-bold text-green-600 mb-1">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Stok: {item.stock > 0 ? item.stock : <span className="text-red-500 font-semibold">Habis</span>}
                  </p>

                  {item.stock > 0 ? (
                    <div className="mt-auto pt-3">
                        <div className="flex items-center">
                            <label htmlFor={`quantity-${item.id}`} className="sr-only">
                                Jumlah untuk {item.name}
                            </label>
                            <input
                                type="number"
                                id={`quantity-${item.id}`}
                                value={itemQuantities[item.id] || 1}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value, item.stock)}
                                min="1"
                                max={item.stock}
                                className="w-20 p-2 border border-r-0 border-gray-300 rounded-l-md text-center focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            <button
                                onClick={() => handleAddToCart(item)}
                                aria-label={`Tambah ${item.name} ke keranjang`}
                                title={`Tambah ${item.name} ke keranjang`}
                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-r-md transition duration-150 ease-in-out flex items-center justify-center"
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                  ) : (
                    <div className="mt-auto pt-3">
                        <p className="text-center text-red-600 font-semibold p-2 border border-red-300 rounded-md bg-red-50">
                            Stok Habis
                        </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {kategori && produk && produk.length === 0 && (
        <div className="text-center p-10">
          <h2 className="text-2xl font-semibold text-gray-700">Produk Tidak Ditemukan</h2>
          <p className="text-gray-500">Tidak ada produk yang tersedia untuk kategori "{kategori}" saat ini.</p>
        </div>
      )}

      {!kategori && !currentSlugBeingDisplayed && (
        <div className="text-center p-10">
          <h2 className="text-2xl font-semibold">Selamat Datang di Menu Kami!</h2>
          <p className="text-gray-500">Silakan pilih kategori di atas untuk melihat produk atau kategori default tidak ditemukan.</p>
        </div>
      )}
     <StoreMap
        name="RB STORE"
        lat={-7.1303241}
        lng={112.7243700}
        address="VP9F+VJC, Jalan Raya, Perumahan Telang Inda, Tellang, Kamal, Bangkalan Regency, East Java 69162"
        phone="+62 444 3436 76767"
        website="http://rb-store/"
      />
      <CustomerReview />
    </AppTemplate>
  );
}