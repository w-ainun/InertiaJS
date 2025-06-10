import AppLayout from "@/components/layouts/courier-layout";
import { router, Head } from "@inertiajs/react";

interface Address {
  id: number;
  street: string;
  more: string | null;
  city: string;
  province: string;
  post_code: string;
  country: string;
}

interface User {
  username: string;
}

interface Order {
  id: number;
  total: number;
  delivery_status: 'menunggu' | 'diambil' | 'sedang dikirim' | 'selesai';
  user?: User;
  address?: Address | null; 
}

export default function DashboardCourier({ orders }: { orders: Order[] }) {
  const ubahStatus = (id: number, status: string) => {
    router.patch(route("courier.update", id), {
      delivery_status: status,
    }, {
      preserveScroll: true, 
    });
  };

  const getFullAddress = (address: Address | null | undefined): string => {
    if (!address) {
        return "Alamat tidak tersedia (Pesanan Tipe Pickup)";
    }
    return [address.street, address.more, address.city, address.province, address.post_code]
        .filter(Boolean) 
        .join(', ');
  }

  const section = (title: string, filter: (o: Order) => boolean, allowChange = false) => (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
              <th className="p-4">Nama Pelanggan</th>
              <th className="p-4">Alamat Pengiriman</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status Pengiriman</th>
              {allowChange && <th className="p-4">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.filter(filter).length === 0 ? (
              <tr>
                <td colSpan={allowChange ? 5 : 4} className="text-center p-8 text-gray-500">
                  Tidak ada pesanan pada seksi ini.
                </td>
              </tr>
            ) : (
              orders.filter(filter).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-4 whitespace-nowrap">{order.user?.username ?? "Tanpa Nama"}</td>
                  <td className="p-4 text-sm text-gray-600 max-w-sm">{getFullAddress(order.address)}</td>
                  <td className="p-4 whitespace-nowrap font-medium">Rp {order.total.toLocaleString('id-ID')}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        order.delivery_status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                        order.delivery_status === 'diambil' ? 'bg-blue-100 text-blue-800' :
                        order.delivery_status === 'sedang dikirim' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                        {order.delivery_status.replace('_', ' ')}
                    </span>
                  </td>
                  {allowChange && (
                    <td className="p-4">
                      <select
                        defaultValue={order.delivery_status}
                        onChange={(e) => ubahStatus(order.id, e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm focus:ring-green-500 focus:border-green-500 transition"
                      >
                        <option value="menunggu">Menunggu</option>
                        <option value="diambil">Diambil</option>
                        <option value="sedang dikirim">Sedang Dikirim</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <AppLayout>
      <Head title="Dashboard Kurir" />
      <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Pengiriman</h1>
          {section("⏳ Pesanan Menunggu Diambil", (o) => o.delivery_status === "menunggu", true)}
          {section("🚚 Pesanan Dalam Proses", (o) =>
            ["diambil", "sedang dikirim"].includes(o.delivery_status), true)}
          {section("✔️ Pesanan Selesai", (o) => o.delivery_status === "selesai", false)}
      </div>
    </AppLayout>
  );
}