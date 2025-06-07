import { useState } from 'react';
import KurirSidebar from "@/components/layouts/KurirSidebar";

interface Pesanan {
  id: number;
  namaPemesan: string;
  alamat: string;
  total: number;
  status: 'menunggu' | 'diambil' | 'selesai';
}

export default function Beranda() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([
    { id: 1, namaPemesan: 'Rudi', alamat: 'Jl. Mawar No.10', total: 35000, status: 'menunggu' },
    { id: 2, namaPemesan: 'Santi', alamat: 'Jl. Melati No.12', total: 42000, status: 'menunggu' },
  ]);

  const ambilPesanan = (id: number) => {
    setPesanan((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'diambil' } : p))
    );
    alert(`Pesanan ${id} berhasil diambil`);
  };

  return (
    <KurirSidebar>
      <h1 className="text-2xl font-bold my-4">Pesanan Siap Dikirim</h1>
      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Pemesan</th>
            <th className="text-left p-2">Alamat</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pesanan.filter(p => p.status === 'menunggu').map((p) => (
            <tr key={p.id}>
              <td className="p-2">{p.namaPemesan}</td>
              <td className="p-2">{p.alamat}</td>
              <td className="p-2">Rp {p.total.toLocaleString()}</td>
              <td className="p-2">
                <button
                  onClick={() => ambilPesanan(p.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Ambil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </KurirSidebar>
  );
}
