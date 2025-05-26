import { Link } from "@inertiajs/react";
import { MapPin } from "lucide-react";

type HeaderLayoutProps = {
  className?: string;
};

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ className = "" }) => {
  return (
    <header
      aria-label="header navigation"
      className={`flex justify-between items-center px-4 h-14 bg-neutral-200 rounded-b-2xl ${className}`}
    >
      <p className="text-black">
        🌟 Get 5% Off your first order,{" "}
        <Link href="#" className="text-[#51793E] font-bold underline">
          Promo: ORDER5
        </Link>
      </p>

      <div className="flex gap-2 items-center text-black">
        <MapPin />
        <p className="text-black">
          <strong>Jl. Telang Indah Barat, Bangkalan</strong>
        </p>
        <Link href="#" className="text-[#51793E] font-bold underline">
          Change Location
        </Link>
      </div>

      <div className="flex items-center gap-1 h-full text-white bg-[#028643] rounded-b-2xl">
        <img src="/svg/cart.svg" alt="cart" className="h-14 w-20 p-2" />
        <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
        <div className="p-4">23 Items</div>
        <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
        <div className="p-4">RP 100.000</div>
        <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
        <img src="/svg/download.svg" alt="download" className="h-14 w-20 p-2" />
      </div>
    </header>
  );
};

export default HeaderLayout;
