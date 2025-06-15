import React, { useState, useEffect } from 'react';
import { Link, usePage } from "@inertiajs/react"; // Pastikan Link diimpor
import { MapPin } from "lucide-react"; // MapPin tidak digunakan, bisa dihapus jika tidak ada lagi
import axios from 'axios';

declare function route(name: string, params?: Record<string, any>): string;

type HeaderLayoutProps = {
  className?: string;
};

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ className = "" }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [errorCart, setErrorCart] = useState<string | null>(null);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price).replace(/\s*IDR\s*/, 'Rp ');
  };

  const fetchCartData = async () => {
    try {
      setLoadingCart(true);
      setErrorCart(null);
      const response = await axios.get(route('client.cart.data'));
      setCartCount(response.data.count);
      setCartTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch cart data for header:", error);
      setErrorCart("Error");
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCartData();
    const handleCartUpdateEvent = () => {
      fetchCartData();
    };
    window.addEventListener('cart-updated', handleCartUpdateEvent);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdateEvent);
    };
  }, []);

  return (
    <header
      aria-label="header navigation"
      className={`flex flex-wrap justify-between items-center px-4 h-auto md:h-14 bg-neutral-200 rounded-b-2xl ${className} transition-all duration-300`}
    >
      <div className="text-black text-sm py-2 md:py-0">
        🌟 Get 5% Off your first order,{" "}
        {/* PERUBAHAN DI SINI: Ganti Link '#' ke rute cart dengan voucher_code */}
        <Link href={route('client.cart.index', { voucher_code: 'FIRSTORDER5' })} className="text-[#51793E] font-bold underline">
          Promo: FIRSTORDER5
        </Link>
      </div>

      <Link
        href={route('client.cart.index')}
        className="flex items-center gap-1 h-full text-white bg-[#028643] rounded-b-2xl md:rounded-b-none md:rounded-bl-2xl text-sm w-full md:w-auto justify-center py-2 md:py-0 order-first md:order-last mt-2 md:mt-0"
      >
        <img src="/svg/cart.svg" alt="cart" className="h-10 md:h-14 w-12 md:w-20 p-1 md:p-2" />
        <div className="h-full w-[1px] bg-[#F0F0FF] hidden md:block"></div>
        <div className="p-2 md:p-4">
          {loadingCart ? "..." : errorCart ? "Error" : `${cartCount} Item${cartCount !== 1 ? 's' : ''}`}
        </div>
        <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
        <div className="p-2 md:p-4">
          {loadingCart ? "..." : errorCart ? "Error" : formatPrice(cartTotal)}
        </div>
        {/* Download icon might be for something else, kept it as is */}
        <div className="h-full w-[1px] bg-[#F0F0FF] hidden md:block"></div>
        <img src="/svg/download.svg" alt="action" className="h-10 md:h-14 w-12 md:w-20 p-1 md:p-2 hidden md:block" />
      </Link>
    </header>
  );
};

export default HeaderLayout;