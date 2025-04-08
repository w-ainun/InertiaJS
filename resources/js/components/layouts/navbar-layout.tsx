import { Link } from "@inertiajs/react";
import NavbarTemplate from "../templates/navbar-template";

export default function NavbarLayout({ ...props }) {
  return (
    <section aria-label="navigation" { ...props }>
      <h1 className="text-[#51793E] font-bold text-5xl">RB Store</h1>
      <NavbarTemplate />
      <div className="flex bg-black text-white rounded-4xl px-6 py-3">
        <img src="/svg/male.svg" alt="user" className="pr-2" />
        <Link href="/login">Login</Link>/
        <Link href="/register">Register</Link>
      </div>
    </section>
  );
};