import React, { useState } from 'react';
import { ShoppingCart, User, Clock, ChevronLeft, Package, Truck, CheckCircle, DollarSign } from 'lucide-react';
import AppTemplate from "@/components/templates/app-template";
import { usePage } from '@inertiajs/react'; // Import usePage to access user data if needed directly in PesananSaya

// Updated User interface based on Laravel migration
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CLIENT' | 'COURIER';
  status: 'active' | 'inactive';
  avatar?: string | null;
  email_verified_at?: string | null;
  remember_token?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Remove user and cartItems from PesananSayaProps as they are no longer passed down to AppTemplate
interface PesananSayaProps {
  // If PesananSaya needs these from a parent (e.g., for initial data before Inertia is fully loaded),
  // they could remain, but for this specific problem, they are being removed.
}

interface TransactionItem {
  id: number;
  date: string;
  time: string;
  item: string;
  category: string;
  quantity: number;
  price: number; // Unit price
  image: string;
}

interface DeliveryOrderItem {
  name: string;
  quantity: number;
  price: number; // Unit price
}

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  service: string;
  courier: string;
  status: 'selesai' | 'diterima' | 'dalam_pengiriman' | 'dikemas' | 'lunas';
  statusTime: string;
  items: DeliveryOrderItem[];
  total: number;
}

// Remove default props for user and cartItems
const PesananSaya: React.FC<PesananSayaProps> = () => {
  const [activeTab, setActiveTab] = useState<'pesanan' | 'riwayat'>('pesanan');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Access user data from Inertia page props
  const { auth } = usePage().props as { auth?: { user: User | null } };
  const user: User | null = auth?.user || null;

  // --- Updated Menu Data (as per previous changes based on images) ---
  const deliveryOrdersData: Omit<DeliveryOrder, 'total'>[] = [
    {
      id: '1',
      orderNumber: 'RB-254083772-AKYTRE',
      service: 'Jasa Kirim Instan',
      courier: 'KURIR TOKO',
      status: 'selesai',
      statusTime: '21 April 2025 - 21:44 wib',
      items: [
        { name: 'Bakwan Sayur', quantity: 3, price: 2500 },
        { name: 'Es Teh Manis', quantity: 1, price: 5000 }
      ],
    },
    {
      id: '2',
      orderNumber: 'RB-254083773-BKLMN',
      service: 'Pengiriman Terjadwal',
      courier: 'KURIR TOKO',
      status: 'dalam_pengiriman',
      statusTime: '25 May 2025 - 14:30 wib',
      items: [
        { name: 'Kue Lumpur', quantity: 2, price: 5000 },
        { name: 'Dadar Gulung', quantity: 2, price: 4000 },
        { name: 'Jus Alpukat', quantity: 1, price: 15000 }
      ],
    },
    {
      id: '3',
      orderNumber: 'RB-254083774-CDEFG',
      service: 'Jasa Kirim Hemat',
      courier: 'KURIR TOKO',
      status: 'dikemas',
      statusTime: '25 May 2025 - 15:15 wib',
      items: [
        { name: 'Brownies Slice', quantity: 1, price: 15000 },
        { name: 'Es Kopi Susu', quantity: 1, price: 18000 }
      ],
    },
    {
      id: '4',
      orderNumber: 'RB-254083775-HIJKL',
      service: 'Ambil Sendiri',
      courier: 'DIAMBIL PELANGGAN',
      status: 'diterima',
      statusTime: '25 May 2025 - 16:00 wib',
      items: [
        { name: 'Red Velvet Slice', quantity: 1, price: 25000 },
        { name: 'Donat Karakter', quantity: 2, price: 8000 },
        { name: 'Thai Tea', quantity: 1, price: 12000 }
      ],
    }
  ];

  const deliveryOrders: DeliveryOrder[] = deliveryOrdersData.map(order => ({
    ...order,
    total: order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }));

  const transactionHistory: TransactionItem[] = [
    {
      id: 1, date: '05 Mar 2025', time: '09.45 WIB', item: 'Klepon', category: 'Kue Basah',
      quantity: 3, price: 3000, image: '/img/klepon_placeholder.jpg',
    },
    {
      id: 2, date: '06 Mar 2025', time: '14.20 WIB', item: 'Tahu Isi Pedas', category: 'Gorengan',
      quantity: 2, price: 3000, image: '/img/tahu_isi_placeholder.jpg',
    },
    {
      id: 3, date: '07 Mar 2025', time: '19.00 WIB', item: 'Puding Coklat Cup', category: 'Puding',
      quantity: 1, price: 15000, image: '/img/puding_coklat_placeholder.jpg',
    }
  ];
  // --- End of Updated Menu Data ---

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selesai': return <Package className="w-6 h-6 text-green-600" />;
      case 'diterima': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'dalam_pengiriman': return <Truck className="w-6 h-6 text-green-600" />;
      case 'dikemas': return <Package className="w-6 h-6 text-green-600" />;
      case 'lunas': return <DollarSign className="w-6 h-6 text-green-600" />;
      default: return <Package className="w-6 h-6 text-gray-400" />; // Fallback icon
    }
  };

  const getStatusText = (status: string) => {
    // This function remains useful for displaying status text in order cards
    switch (status) {
      case 'selesai': return 'Selesai';
      case 'diterima': return 'Diterima';
      case 'dalam_pengiriman': return 'Dalam Pengiriman';
      case 'dikemas': return 'Dikemas';
      case 'lunas': return 'Lunas';
      default: return status;
    }
  };

  // Reverted getTrackingSteps to simpler version (as per original user code structure)
  const getTrackingSteps = (status: string, orderNumber: string) => {
    const baseSteps = [
      { status: 'lunas', label: 'Lunas', time: '' },
      { status: 'dikemas', label: 'Dikemas', time: '' },
      { status: 'dalam_pengiriman', label: 'Dalam Pengiriman', time: '' },
      { status: 'diterima', label: 'Diterima', time: '' },
      { status: 'selesai', label: 'Selesai', time: '' }
    ];

    // Different tracking data based on orderNumber (status argument is not used by this switch)
    switch (orderNumber) {
      case 'RB-254083772-AKYTRE':
        return [
          { status: 'selesai', label: 'Selesai', time: '21 April 2025 - 21:44 wib' },
          { status: 'diterima', label: 'Diterima', time: '21 April 2025 - 21:30 wib' },
          { status: 'dalam_pengiriman', label: 'Dalam Pengiriman', time: '21 April 2025 - 21:15 wib' },
          { status: 'dikemas', label: 'Dikemas', time: '21 April 2025 - 21:10 wib' },
          { status: 'lunas', label: 'Lunas', time: '21 April 2025 - 21:00 wib' }
        ];
      case 'RB-254083773-BKLMN':
        return [
          { status: 'dalam_pengiriman', label: 'Dalam Pengiriman', time: '25 May 2025 - 14:30 wib' },
          { status: 'dikemas', label: 'Dikemas', time: '25 May 2025 - 14:15 wib' },
          { status: 'lunas', label: 'Lunas', time: '25 May 2025 - 14:00 wib' }
        ];
      case 'RB-254083774-CDEFG':
        return [
          { status: 'dikemas', label: 'Dikemas', time: '25 May 2025 - 15:15 wib' },
          { status: 'lunas', label: 'Lunas', time: '25 May 2025 - 15:00 wib' }
        ];
      case 'RB-254083775-HIJKL':
        return [
          { status: 'diterima', label: 'Diterima', time: '25 May 2025 - 16:00 wib' },
          { status: 'dalam_pengiriman', label: 'Dalam Pengiriman', time: '25 May 2025 - 15:45 wib' },
          { status: 'dikemas', label: 'Dikemas', time: '25 May 2025 - 15:30 wib' },
          { status: 'lunas', label: 'Lunas', time: '25 May 2025 - 15:15 wib' }
        ];
      default:
        // For unknown orderNumbers, return baseSteps (all steps with empty times).
        // This mirrors the behavior of the original code structure.
        return baseSteps;
    }
  };

  // This was how trackingSteps was defined in the original code structure.
  // It's calculated regardless of whether an order is selected, then used if an order is selected.
  const orderDataForTracking = selectedOrder ? deliveryOrders.find(o => o.id === selectedOrder) : null;
  const trackingStepsToDisplay = getTrackingSteps(
    orderDataForTracking?.status || '',
    orderDataForTracking?.orderNumber || ''
  );

  if (selectedOrder) {
    const order = deliveryOrders.find(o => o.id === selectedOrder);
    if (order) {
      // Note: trackingStepsToDisplay is used here, which is defined outside this block.
      return (
        // Remove user and cartItems props from AppTemplate
        <AppTemplate>
          {/* Page Title */}
          <div className="bg-green-700 text-white py-6 relative">
            <div className="px-4 flex items-center">
              <ChevronLeft
                size={24}
                className="cursor-pointer absolute left-4"
                onClick={() => setSelectedOrder(null)}
              />
              <h1 className="text-2xl font-bold text-center w-full">Pengiriman</h1>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="w-full mt-8 px-4 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">No. Pengiriman :</h2>
                <p className="text-gray-600 text-lg">{order.orderNumber}</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-medium">{order.service}</h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-medium">{order.courier}</span>
                </div>
              </div>
            </div>

            {/* Tracking Steps */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4">Status Pengiriman</h3>
              <div className="space-y-6">
                {trackingStepsToDisplay.map((step, index) => (
                  <div key={step.status + index} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        {getStatusIcon(step.status)}
                      </div>
                      {index < trackingStepsToDisplay.length - 1 && (
                        <div className="w-px h-12 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-medium">{step.label}</h4>
                      <p className="text-gray-600">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Detail */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4">Detail Pesanan</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <Package size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rp. {(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">(@ Rp. {item.price.toLocaleString()})</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Pesanan</span>
                    <span className="text-xl font-bold text-green-600">Rp. {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info - Conditionally render if user data is available */}
            {user && ( // Only render if user data is available
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-medium mb-4">Informasi Pengiriman</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nama Penerima</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-medium ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Alamat</p>
                    <p className="font-medium">Jl. Telang Indah Barat, Bangkalan</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kurir</p>
                    <p className="font-medium">{order.courier}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AppTemplate>
      );
    }
    return <div>Order not found. <button onClick={() => setSelectedOrder(null)} className="text-blue-500">Back to list</button></div>;
  }

  // Main view (Order list / Transaction History tabs)
  return (
    // Remove user and cartItems props from AppTemplate
    <AppTemplate>
      {/* Page Title for Tabs */}
      <div className="bg-green-700 text-white py-6 relative">
        <div className="px-4 flex items-center">
          {/* Note: This ChevronLeft currently does nothing in the main view. */}
          <ChevronLeft size={24} className="cursor-pointer absolute left-4" />
          <h1 className="text-2xl font-bold text-center w-full">
            {activeTab === 'pesanan' ? 'Pesanan Saya' : 'Transaksi Saya'}
          </h1>
        </div>
      </div>

      {/* Tabs and Content Container */}
      <div className="w-full mt-8 px-4">
        <div className="flex border-b">
          <div className="flex items-center mb-4 cursor-pointer mr-8" onClick={() => setActiveTab('pesanan')}>
            <div className="p-2 rounded-full border mr-3">
              <ShoppingCart size={24} className={activeTab === 'pesanan' ? 'text-green-600' : 'text-gray-500'} />
            </div>
            <span className={`text-xl font-medium ${activeTab === 'pesanan' ? 'text-green-600 border-b-2 border-green-600 pb-1' : 'text-gray-500'}`}>
              Pesanan
            </span>
          </div>
          <div className="flex items-center mb-4 cursor-pointer" onClick={() => setActiveTab('riwayat')}>
            <div className="p-2 rounded-full border mr-3">
              <Clock size={24} className={activeTab === 'riwayat' ? 'text-green-600' : 'text-gray-500'} />
            </div>
            <span className={`text-xl font-medium ${activeTab === 'riwayat' ? 'text-green-600 border-b-2 border-green-600 pb-1' : 'text-gray-500'}`}>
              Riwayat Transaksi
            </span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'pesanan' && (
            <div className="space-y-4">
              {deliveryOrders.length > 0 ? (
                deliveryOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOrder(order.id)}>
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">No. Pesanan</p>
                          <p className="font-medium">{order.orderNumber}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className="ml-2 text-green-600 font-medium">
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{order.statusTime}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{order.service} ({order.courier})</h3>
                          {order.items.slice(0, 2).map((item, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.name} {index === 1 && order.items.length > 2 && '...'}
                            </p>
                          ))}
                          {order.items.length === 0 && <p className="text-sm text-gray-500">Tidak ada item.</p>}
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-medium text-lg">
                            Rp. {order.total.toLocaleString()}
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 text-sm hover:bg-green-700" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); }}>
                            Lihat Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Package size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-xl">Anda belum memiliki pesanan aktif.</p>
                  <p>Silakan buat pesanan baru untuk melihatnya di sini.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'riwayat' && (
            <>
              {transactionHistory.length > 0 ? (
                <div className="space-y-4">
                  {transactionHistory.map((transaction) => (
                    <div key={transaction.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4 border-b bg-gray-50">
                        <div className="flex justify-between items-center text-gray-700">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-green-700">Transaksi Selesai</div>
                              <div className="text-sm text-gray-500">{transaction.date} - {transaction.time}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold">Rp. {(transaction.price * transaction.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex items-center">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 mr-4">
                          <img src={transaction.image} alt={transaction.item} className="w-full h-full object-cover text-xs text-gray-400 flex items-center justify-center" onError={(e) => (e.currentTarget.outerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><Package size={32} /></div>')} />
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xl font-medium">{transaction.item}</h3>
                              <p className="text-gray-600">{transaction.category}</p>
                              <p className="text-gray-800_">{transaction.quantity}x @ Rp. {transaction.price.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <button className="bg-green-600 text-white px-6 py-2 rounded-lg mt-2 hover:bg-green-700">
                                Beli Lagi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-xl">Riwayat transaksi Anda kosong.</p>
                  <p>Semua transaksi yang telah selesai akan muncul di sini.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppTemplate>
  );
};

export default PesananSaya;