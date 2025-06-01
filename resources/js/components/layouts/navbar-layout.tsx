// NavbarLayout.tsx
import FigureCap from '../fragments/figcap';
import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from 'react';

// Tipe user
type User = {
  id: number;
  username: string;
  email: string;
};

// Props untuk komponen ini
type NavbarLayoutProps = {
  className?: string;
  user?: User | null;
};

// Define your navigation links here
const primaryNavLinks = [
  { label: "Beranda", href: "/Homepage" },
  { label: "Menu", href: "/menu" },
  { label: "Pesanan", href: "/pesanan-saya" },
  // { label: "Track Order", href: "/order" }, // Uncomment if needed
];

export default function NavbarLayout({ className = "", user: initialUser = null }: NavbarLayoutProps) {
  const { url } = usePage();
  const [activePage, setActivePage] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setActivePage(url);
  }, [url]);

  useEffect(() => {
    console.log("👤 User dari props:", initialUser);
    setUser(initialUser);
  }, [initialUser]);

  const handleLogout = () => {
    router.post('/logout');
  };

  // Helper function for consistent link styling
  const getLinkClasses = (href: string) => {
    // Check for exact match or startsWith for nested routes (e.g., /menu/item1)
    const isActive = url === href || (href !== '/' && url.startsWith(href + '/'));
    if (href === '/Homepage' && url === '/') { // Special case for homepage if your root is '/'
      return "bg-[#028643] text-white";
    }

    return `flex items-center rounded-full px-6 py-1 font-medium transition-colors duration-200 ${
      isActive
        ? "bg-[#028643] text-white"
        : "bg-gray-200 text-black hover:bg-[#028643] hover:text-white"
    }`;
  };

  return (
    <section aria-label="navigation" className={`flex justify-between items-center ${className}`}>
      <FigureCap src="/RB-Store1.png" alt="RB Store Logo" className="w-72" /> {/* Added descriptive alt text */}

      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          {primaryNavLinks.map(({ label, href }) => (
            <Link
              key={href} // Use href as key
              href={href}
              className={getLinkClasses(href)}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center rounded-4xl bg-black px-6 py-3 text-white ml-4">
          {!user ? (
            <>
              <img src="/svg/male.svg" alt="user icon" className="pr-2 h-6 w-6" /> {/* Added alt text */}
              <Link href="/login" className="hover:underline">Login</Link>
              <span className="px-1">/</span>
              <Link href="/register" className="hover:underline">Register</Link>
            </>
          ) : (
            <>
              <img src="/svg/male.svg" alt="user icon" className="pr-2 h-6 w-6" /> {/* Added alt text */}
              <Link href={route('profile.show')} className="hover:underline">
                Halo, {user.username}
              </Link>
              {/* Uncomment this button when ready to enable logout */}
              <button onClick={handleLogout} className="ml-4 underline">Logout</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}