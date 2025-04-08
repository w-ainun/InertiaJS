import { Link } from "@inertiajs/react";
import { MapPin } from "lucide-react";

export default function HeaderLayout({ ...props }) {
  return (
    <header aria-label="header navigation" { ...props }>
      <p className="pl-4">🌟 Get 5% Off your first order, <Link href="#" className="text-[#51793E] font-bold underline">Promo: ORDER5</Link>
      </p>
      <div className="flex gap-2">
        <MapPin />
        <p>Jl. Telang Indah Barat, Bangkalan</p>
        <Link href="#" className="text-[#51793E] font-bold underline">
          Change Location
        </Link>
      </div>
      <div className="flex items-center gap-1 h-full text-white bg-[#028643] rounded-b-2xl">
        <img src="/svg/cart.svg" alt="cart" className="h-14 w-20 p-2" />
        <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
        <div className="p-4">23 Items</div>
        <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
        <div className="p-4">GBP 79.89</div>
        <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
        <img src="/svg/download.svg" alt="download" className="h-14 w-20 p-2" />
      </div>
    </header>
  );
};