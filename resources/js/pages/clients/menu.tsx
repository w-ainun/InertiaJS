import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppTemplate from "@/components/templates/app-template";
import CustomerReview from "@/components/layouts/review";
import KategoriJumbotron from "@/components/layouts/kategori-jumbotron";
import { Plus, ShoppingCart } from 'lucide-react'; // Tambahkan ShoppingCart, Plus mungkin masih digunakan atau bisa dihapus jika tidak ada lagi

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

// Props gabungan untuk halaman menu
interface MenuPageProps {
  categories: Category[];
  kategori?: string;
  produk?: Produk[];
  gambar?: string;
  notice?: string;
  currentSlugBeingDisplayed?: string;
}

export default function MenuPage({
  categories,
  kategori,
  produk,
  gambar,
  notice,
  currentSlugBeingDisplayed
}: MenuPageProps) {

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
                                <ShoppingCart className="w-5 h-5" /> {/* ICON DIGANTI DI SINI */}
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

      <CustomerReview />
    </AppTemplate>
  );
}