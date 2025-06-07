import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function KurirSidebar({ children }: { children: React.ReactNode }) {
  const { url } = usePage();
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md border-r transition-all duration-300 ease-in-out ${
          open ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className={`text-lg font-bold text-green-600 transition-all duration-200 ${open ? "block" : "hidden"}`}>
            Dashboard
          </span>
          <button onClick={() => setOpen(!open)} className="md:hidden">
            ✖
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/courier"
            className={`px-4 py-2 rounded ${
              url === "/courier" ? "bg-green-500 text-white" : "hover:bg-green-100"
            }`}
          >
            {open ? "Halaman Utama" : "🏠"}
          </Link>
          <Link
            href="/courier/diambil"
            className={`px-4 py-2 rounded ${
              url === "/courier/diambil" ? "bg-green-500 text-white" : "hover:bg-green-100"
            }`}
          >
            {open ? "Orderan Diambil" : "📦"}
          </Link>
          <Link
            href="/courier/selesai"
            className={`px-4 py-2 rounded ${
              url === "/courier/selesai" ? "bg-green-500 text-white" : "hover:bg-green-100"
            }`}
          >
            {open ? "Pengiriman Selesai" : "✅"}
          </Link>
        </nav>
      </div>

      {/* Konten Halaman */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header + Toggle */}
        <div className="bg-white shadow px-4 py-3 flex items-center border-b">
          <button onClick={() => setOpen(!open)} className="md:hidden">
            <Menu size={24} />
          </button>
          <h2 className="ml-4 text-xl font-bold text-green-600">for header or some shi</h2>
        </div>

        {/* Konten halaman */}
        <div className="p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
