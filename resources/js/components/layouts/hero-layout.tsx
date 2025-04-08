import { Link } from "@inertiajs/react";

const HeroLayout = ({ ...props }) => {
  return (
    <main { ... props }>
      <div id="hero-section">
        <div id="nav" className="mt-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Up to -40%🎊RB Store exclusive deals</h1>
          <div className="flex items-center">
              <Link href="#" className="px-13">
                Gorengan
              </Link>
              <Link href="#" className="px-13">
                Kue Kering
              </Link>
              <Link href="#" className="rounded-4xl border border-green-300 px-13 py-2">
                Kue Basah
              </Link>
              <Link href="#" className="px-13">
                others
              </Link>
            </div>
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

      <div id="categories" className="mt-10">
        <h1 className="text-3xl font-bold">RB Store Popular Categories 🤩</h1>
        <div className="mt-6 flex gap-3">
          <div className="card">
            <img src="/img/categories/kue-basah.png" alt="kue" />
            <div className="bg-[#F5F5F5] p-4">
              <h1 className="font-bold">Kue Basah</h1>
              <span className="text-[#FC8A06]">21 Restaurant</span>
            </div>
          </div>
          <div className="card">
            <img src="/img/categories/kue-kering.png" alt="kue" />
            <div className="bg-[#F5F5F5] p-4">
              <h1 className="font-bold">Kue Kering</h1>
              <span className="text-[#FC8A06]">32 Restaurant</span>
            </div>
          </div>
          <div className="card">
            <img src="/img/categories/kue-modern.png" alt="kue" />
            <div className="bg-[#F5F5F5] p-4">
              <h1 className="font-bold">Kue Modern</h1>
              <span className="text-[#FC8A06]">4 Restaurant</span>
            </div>
          </div>
          <div className="card">
            <img src="/img/categories/gorengan.png" alt="kue" />
            <div className="bg-[#F5F5F5] p-4">
              <h1 className="font-bold">Gorengan</h1>
              <span className="text-[#FC8A06]">32 Restaurant</span>
            </div>
          </div>
          <div className="card">
            <img src="/img/categories/minuman.png" alt="kue" />
            <div className="bg-[#F5F5F5] p-4">
              <h1 className="font-bold">Minuman</h1>
              <span className="text-[#FC8A06]">4 Restaurant</span>
            </div>
          </div>
          <div className="card">
            <img src="/img/categories/puding.png" alt="kue" />
            <div className="bg-[#F5F5F5] p-4">
              <h1 className="font-bold">Puding</h1>
              <span className="text-[#FC8A06]">32 Restaurant</span>
            </div>
          </div>
        </div>
      </div>

      <div id="us" className="mt-10">
        <h1 className="text-3xl font-bold">Why Choose Us?</h1>
        <div className="mt-6 flex gap-3">
            <div className="card rounded-2xl bg-[#51793E]">
              <img src="/us.png" alt="kue" className="rounded-2xl" />
              <div className="flex items-center justify-center rounded-b-2xl p-4 font-bold text-white">
                <h1>Warisan Nusantara</h1>
              </div>
            </div>
            <div className="card rounded-2xl bg-[#51793E]">
              <img src="/us.png" alt="kue" className="rounded-2xl" />
              <div className="flex items-center justify-center rounded-b-2xl p-4 font-bold text-white">
                <h1>Warisan Nusantara</h1>
              </div>
            </div>
            <div className="card rounded-2xl bg-[#51793E]">
              <img src="/us.png" alt="kue" className="rounded-2xl" />
              <div className="flex items-center justify-center rounded-b-2xl p-4 font-bold text-white">
                <h1>Warisan Nusantara</h1>
              </div>
            </div>
            <div className="card rounded-2xl bg-[#51793E]">
              <img src="/us.png" alt="kue" className="rounded-2xl" />
              <div className="flex items-center justify-center rounded-b-2xl p-4 font-bold text-white">
                <h1>Warisan Nusantara</h1>
              </div>
            </div>
            <div className="card rounded-2xl bg-[#51793E]">
              <img src="/us.png" alt="kue" className="rounded-2xl" />
              <div className="flex items-center justify-center rounded-b-2xl p-4 font-bold text-white">
                <h1>Warisan Nusantara</h1>
              </div>
            </div>
            <div className="card rounded-2xl bg-[#51793E]">
              <img src="/us.png" alt="kue" className="rounded-2xl" />
              <div className="flex items-center justify-center rounded-b-2xl p-4 font-bold text-white">
                <h1>Warisan Nusantara</h1>
              </div>
            </div>
          </div>
      </div>
    </main>
  );
};

export default HeroLayout;
