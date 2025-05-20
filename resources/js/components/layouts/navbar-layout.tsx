import { Link } from '@inertiajs/react';
import FigureCap from '../fragments/figcap';
import NavbarTemplate from '../navbar-template';

type NavbarLayoutProps = {
  className?: string;
};

export default function NavbarLayout({ className = "", ...props }: NavbarLayoutProps) {
  return (
    <section
      aria-label="navigation"
      className={`flex justify-between items-center ${className}`}
      {...props}
    >
      <FigureCap src="/RB-Store.png" alt="RB Store" className="w-72" />

      <div className="flex items-center gap-6">
        {/* Menu Navigasi */}
        <NavbarTemplate />

        {/* Login / Register */}
        <div className="flex items-center rounded-4xl bg-black px-6 py-3 text-white">
          <img src="/svg/male.svg" alt="user" className="pr-2 h-6 w-6" />
          <Link href={route('login')} className="hover:underline">Login</Link>
          <span className="px-1">/</span>
          <Link href={route('register')} className="hover:underline">Register</Link>
        </div>
      </div>
    </section>
  );
}
