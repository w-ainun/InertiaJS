import AppTemplate from "@/components/templates/app-template";
import CustomerReview from "@/components/layouts/review";
import KategoriJumbotron from "@/components/layouts/kategori-jumbotron";
import Main from "@/components/layouts/main-menu";
import { Link } from "@inertiajs/react"; // usePage tidak lagi diperlukan untuk slug aktif utama

// Interface untuk Produk
interface Produk {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
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
  currentSlugBeingDisplayed?: string; // Prop baru untuk slug yang sedang ditampilkan
}

export default function MenuPage({
  categories,
  kategori,
  produk,
  gambar,
  notice,
  currentSlugBeingDisplayed // Terima prop baru
}: MenuPageProps) {

  return (
    <AppTemplate className="bg-[#FFFFFF]">
      {kategori && gambar && notice && (
        <KategoriJumbotron
          judul={kategori}
          keterangan={notice}
          gambar={gambar}
        />
      )}

      <div className="mx-16 mt-4">
        <form>
          <input type="text" placeholder="Search For Menu.." className="w-full rounded-full p-3 border" />
        </form>
      </div>

      <nav aria-label="products navigation display">
        <ul className="flex flex-wrap justify-around p-3 mt-5 gap-3 bg-[#F3F3F3] text-xl md:text-2xl font-bold">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/menu/${cat.slug}`}
                className={`text-black hover:bg-black hover:text-white px-3 py-1 md:px-5 rounded-full transition ${
                  // Gunakan currentSlugBeingDisplayed untuk menentukan kelas aktif
                  currentSlugBeingDisplayed === cat.slug ? 'bg-black text-white' : ''
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {kategori && produk && (
        <Main kategori={kategori} produk={produk} />
      )}
      
      {!kategori && !currentSlugBeingDisplayed && ( // Tampilkan ini hanya jika tidak ada kategori default dan tidak ada slug
        <div className="text-center p-10">
          <h2 className="text-2xl font-semibold">Selamat Datang di Menu Kami!</h2>
          <p>Silakan pilih kategori di atas untuk melihat produk atau kategori default tidak ditemukan.</p>
        </div>
      )}

      <CustomerReview />
    </AppTemplate>
  );
}