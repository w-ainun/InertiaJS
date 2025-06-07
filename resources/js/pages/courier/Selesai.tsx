import KurirSidebar from "@/components/layouts/KurirSidebar";

interface Pesanan {
  id: number;
  namaPemesan: string;
  alamat: string;
  total: number;
}

const pesananSelesai: Pesanan[] = [
  { id: 101, namaPemesan: 'Nina', alamat: 'Jl. Teratai No.21', total: 55000 },
  { id: 102, namaPemesan: 'Wawan', alamat: 'Jl. Kenanga No.7', total: 30000 },
];

export default function Selesai() {
  return (
    <KurirSidebar>
      <h1 className="text-2xl font-bold my-4">Pengiriman Selesai</h1>
      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Pemesan</th>
            <th className="text-left p-2">Alamat</th>
            <th className="text-left p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {pesananSelesai.map((p) => (
            <tr key={p.id}>
              <td className="p-2">{p.namaPemesan}</td>
              <td className="p-2">{p.alamat}</td>
              <td className="p-2">Rp {p.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </KurirSidebar>
  );
}
