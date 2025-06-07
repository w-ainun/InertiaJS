import { useState } from 'react';
import KurirSidebar from "@/components/layouts/KurirSidebar";

interface Pesanan {
  id: number;
  namaPemesan: string;
  alamat: string;
  total: number;
  status: 'diambil' | 'sedang dikirim' | 'selesai';
}

export default function Diambil() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([
    { id: 1, namaPemesan: 'Rudi', alamat: 'Jl. Mawar No.10', total: 35000, status: 'diambil' },
    { id: 2, namaPemesan: 'Santi', alamat: 'Jl. Melati No.12', total: 42000, status: 'diambil' },
  ]);

  const updateStatus = (id: number, statusBaru: Pesanan['status']) => {
    setPesanan(prev => prev.map(p => p.id === id ? { ...p, status: statusBaru } : p));
    alert(`Status pesanan ${id} diubah ke "${statusBaru}"`);
  };

  return (
    <KurirSidebar>
      <h1 className="text-2xl font-bold my-4">Pesanan Diambil</h1>
      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Pemesan</th>
            <th className="text-left p-2">Alamat</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Ubah Status</th>
          </tr>
        </thead>
        <tbody>
          {pesanan
            .filter(p => p.status === 'diambil' || p.status === 'sedang dikirim')
            .map((p) => (
              <tr key={p.id}>
                <td className="p-2">{p.namaPemesan}</td>
                <td className="p-2">{p.alamat}</td>
                <td className="p-2">Rp {p.total.toLocaleString()}</td>
                <td className="p-2">
                  <select
                    className="border px-2 py-1 rounded"
                    value={p.status}
                    onChange={(e) => updateStatus(p.id, e.target.value as Pesanan['status'])}
                  >
                    <option value="diambil">Diambil</option>
                    <option value="sedang dikirim">Sedang Dikirim</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </KurirSidebar>
  );
}
