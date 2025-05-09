import { Link } from "@inertiajs/react";
import NavbarTemplate from "../templates/navbar-template";
import FigureCap from "../fragments/figcap";

export default function NavbarLayout({ ...props }) {
  return (
    <section aria-label="navigation" { ...props }>
      <FigureCap src="/RB-Store.png" alt="RB Store" className="w-72" />
      <div className="flex items-center gap-6">
        <NavbarTemplate />
        <div className="flex bg-black text-white rounded-4xl px-6 py-3">
          <img src="/svg/male.svg" alt="user" className="pr-2" />
          <Link href={route('login')}>Login</Link>/
          <Link href={route('register')}>Register</Link>
        </div>
      </div>
    </section>
  );
};