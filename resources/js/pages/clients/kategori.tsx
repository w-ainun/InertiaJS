import KategoriJumbotron from "@/components/layouts/kategori-jumbotron";
import Main from "@/components/layouts/main-menu";
import AppTemplate from "@/components/templates/app-template";
import CustomerReview from "@/components/layouts/review";

interface Produk {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface Props {
  kategori: string;
  produk: Produk[];
  gambar: string;
  notice: string;
}

export default function KategoriPage({ kategori, produk, gambar, notice }: Props) {
  return (
    <AppTemplate>
      <KategoriJumbotron
        judul={kategori}
        keterangan={notice}
        gambar={gambar}
      />

      {/* Search input */}
      <form className="mx-16 mt-4">
        <input type="text" placeholder="Search For Menu.." className="w-full rounded-full p-3 border" />
      </form>
        
        <nav aria-label="products navigation display">
        <ul className="flex justify-around p-3 mt-5 gap-3 bg-[#F3F3F3] text-2xl font-bold">
          <li className="rounded-full px-5 py-1 text-white bg-black">
            <Link href="/menu/kue-basah">Kue Basah</Link>
          </li>
          <li className="text-black">
            <Link href="/menu/kue-kering">Kue Kering</Link>
          </li>
          <li className="text-black">
            <Link href="/menu/kue-modern">Kue Modern</Link>
          </li>
          <li className="text-black">
            <Link href="/menu/gorengan">Gorengan</Link>
          </li>
          <li className="text-black">
            <Link href="/menu/minuman">Minuman</Link>
          </li>
          <li className="text-black">
            <Link href="/menu/puding">Pudding</Link>
          </li>
        </ul>
      </nav>

      {/* Tampilkan produk */}
      <Main kategori={kategori} produk={produk} />

      <CustomerReview />
    </AppTemplate>
  );
}
