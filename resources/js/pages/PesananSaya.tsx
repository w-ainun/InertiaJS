// PesananSaya.tsx

import React, { useState } from 'react';
import { ShoppingCart, User as UserIconLucide, Clock, ChevronLeft, Package, Truck, CheckCircle, DollarSign, AlertCircle, XCircle, Archive } from 'lucide-react';
import AppTemplate from "@/components/templates/app-template";
import { usePage, router } from '@inertiajs/react';
import { PageProps as InertiaBasePageProps } from '@inertiajs/core'; // Import base PageProps

// --- User Interface (ensure this matches what's shared via HandleInertiaRequests) ---
interface User {
  id: number;
  username: string;
  email: string;
  // role: 'ADMIN' | 'CLIENT' | 'COURIER'; // Defined in your original code
  // status: 'active' | 'inactive'; // Defined in your original code
  avatar?: string | null;
  contact?: {
    phone?: string | null;
    addresses?: BackendAddress[]; // Or however addresses are structured if shared on user
  };
  // Add other fields if accessed directly from auth.user in this component
}

interface AuthProps { // Define a type for the 'auth' shared prop
    user: User | null;
    // Include any other properties shared under 'auth'
}

// --- Backend Data Structures (as previously defined) ---
interface BackendItem {
  id: number;
  name: string;
}

interface BackendTransactionDetail {
  id: number;
  item: BackendItem;
  quantity: number;
  price_at_time: string;
  discount_percentage_at_time: number | null;
}

interface BackendAddress {
  id: number;
  street: string;
  more?: string | null;
  city: string;
  province: string;
  post_code: string;
  country: string;
}

interface BackendTransaction {
  id: number;
  order_number_display: string;
  client_id: number;
  total: string;
  note?: string | null;
  payment_method: string;
  status: 'pending' | 'paid' | 'settlement' | 'capture' | 'challenge' | 'deny' | 'expire' | 'cancel' | 'failed' | 'dikemas' | 'dalam_pengiriman' | 'diterima' | 'selesai' | string;
  delivery_option: 'delivery' | 'pickup';
  shipping_cost: string;
  address_id?: number | null;
  address?: BackendAddress | null;
  details: BackendTransactionDetail[];
  created_at: string;
  updated_at: string;
}

// --- Frontend Display Structures (as previously defined) ---
interface DeliveryOrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  service: string;
  courier: string;
  status: BackendTransaction['status'];
  statusTime: string;
  items: DeliveryOrderItem[];
  total: number;
  deliveryOption?: 'delivery' | 'pickup';
  shippingAddress?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  paymentMethod?: string;
  shippingCost?: number;
  rawCreatedAt: string;
  rawUpdatedAt: string;
}

// --- Corrected Page Props Interface ---
// This interface now extends InertiaBasePageProps and includes 'auth'
interface PesananSayaPageProps extends InertiaBasePageProps {
  activeOrders: BackendTransaction[];
  historicalOrders: BackendTransaction[];
  auth: AuthProps; // 'auth' is a standard shared prop from HandleInertiaRequests
  // flash?: { success?: string; error?: string; /* ... */ }; // Add if you use flash messages directly here
  // errors?: Record<string, string>; // Add if you use shared errors directly here
}


const PesananSaya: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pesanan' | 'riwayat'>('pesanan');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Use the corrected PesananSayaPageProps with usePage
  const page = usePage<PesananSayaPageProps>();
  const { activeOrders: rawActiveOrders, historicalOrders: rawHistoricalOrders, auth } = page.props;
  const authUser = auth.user; // Now authUser is correctly typed based on AuthProps

  // ... rest of your component logic (formatCurrency, formatDate, transformTransactionToDisplayOrder, etc.) ...
  // No changes needed for the rest of the component's internal logic from the previous answer.

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount).replace(/\s*IDR\s*/, 'Rp ');
  };

  const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
    };
    return new Date(dateString).toLocaleString('id-ID', { ...defaultOptions, ...options });
  };

  const transformTransactionToDisplayOrder = (transaction: BackendTransaction): DeliveryOrder => {
    const items = transaction.details.map(detail => {
      const originalPrice = parseFloat(detail.price_at_time);
      const discount = detail.discount_percentage_at_time || 0;
      const priceAfterDiscount = originalPrice * (1 - discount / 100);
      return {
        name: detail.item.name,
        quantity: detail.quantity,
        price: priceAfterDiscount,
      };
    });

    let service = 'Tidak Diketahui';
    let courier = '-';
    if (transaction.delivery_option === 'delivery') {
      service = 'Pengiriman ke Alamat';
      courier = 'KURIR TOKO';
    } else if (transaction.delivery_option === 'pickup') {
      service = 'Ambil Sendiri';
      courier = 'DIAMBIL PELANGGAN';
    }

    let shippingAddressSummary = null;
    if (transaction.delivery_option === 'delivery' && transaction.address) {
        const addr = transaction.address;
        shippingAddressSummary = [addr.street, addr.more, addr.city, addr.province, addr.post_code, addr.country].filter(Boolean).join(', ');
    }

    return {
      id: String(transaction.id),
      orderNumber: transaction.order_number_display,
      service,
      courier,
      status: transaction.status,
      statusTime: formatDate(transaction.updated_at),
      items,
      total: parseFloat(transaction.total),
      deliveryOption: transaction.delivery_option,
      shippingAddress: shippingAddressSummary,
      notes: transaction.note || null,
      createdAt: formatDate(transaction.created_at),
      updatedAt: formatDate(transaction.updated_at),
      paymentMethod: transaction.payment_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      shippingCost: parseFloat(transaction.shipping_cost),
      rawCreatedAt: transaction.created_at,
      rawUpdatedAt: transaction.updated_at,
    };
  };

  const activeDisplayOrders: DeliveryOrder[] = rawActiveOrders.map(transformTransactionToDisplayOrder);
  const historicalDisplayOrders: DeliveryOrder[] = rawHistoricalOrders.map(transformTransactionToDisplayOrder);

  const selectedOrderData = selectedOrderId
    ? [...activeDisplayOrders, ...historicalDisplayOrders].find(o => o.id === selectedOrderId)
    : null;

  const getStatusIcon = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'selesai':
      case 'diterima':
      case 'paid':
      case 'settlement':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'dalam_pengiriman':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'dikemas':
        return <Package className="w-6 h-6 text-indigo-600" />;
      case 'pending':
      case 'capture':
      case 'challenge':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'lunas':
        return <DollarSign className="w-6 h-6 text-green-600" />;
      case 'failed':
      case 'deny':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'canceled':
      case 'expired':
        return <Archive className="w-6 h-6 text-gray-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = (status: DeliveryOrder['status']) => {
    const statusMap: Record<string, string> = {
      'pending': 'Menunggu Pembayaran',
      'paid': 'Lunas',
      'settlement': 'Lunas (Settlement)',
      'capture': 'Pembayaran Diproses',
      'challenge': 'Pembayaran Ditinjau',
      'deny': 'Pembayaran Ditolak',
      'expire': 'Kadaluarsa',
      'cancel': 'Dibatalkan',
      'failed': 'Gagal',
      'dikemas': 'Dikemas',
      'dalam_pengiriman': 'Dalam Pengiriman',
      'diterima': 'Diterima Pelanggan',
      'selesai': 'Selesai',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getDynamicTrackingSteps = (order: DeliveryOrder | null) => {
    if (!order) return [];

    const steps: Array<{ status: string; label: string; time: string; active: boolean; isCurrent: boolean }> = [];
    const { status: currentStatus, rawCreatedAt, rawUpdatedAt, paymentMethod } = order;

    const paidStatuses: BackendTransaction['status'][] = ['paid', 'settlement', 'dikemas', 'dalam_pengiriman', 'diterima', 'selesai'];
    if (paidStatuses.includes(currentStatus) || (currentStatus === 'pending' && paymentMethod === 'free_order')) {
        let paidTime = rawCreatedAt;
        if (currentStatus === 'paid' || currentStatus === 'settlement') {
            paidTime = rawUpdatedAt;
        }
        steps.push({ status: 'lunas', label: 'Lunas', time: formatDate(paidTime), active: true, isCurrent: currentStatus === 'paid' || currentStatus === 'settlement' });
    } else if (currentStatus === 'pending') {
         steps.push({ status: 'pending', label: 'Menunggu Pembayaran', time: formatDate(rawUpdatedAt), active: true, isCurrent: true });
    }

    const packedStatuses: BackendTransaction['status'][] = ['dikemas', 'dalam_pengiriman', 'diterima', 'selesai'];
    if (packedStatuses.includes(currentStatus)) {
      steps.push({ status: 'dikemas', label: 'Dikemas', time: currentStatus === 'dikemas' ? formatDate(rawUpdatedAt) : 'Sesuai jadwal', active: true, isCurrent: currentStatus === 'dikemas' });
    }

    const shippedStatuses: BackendTransaction['status'][] = ['dalam_pengiriman', 'diterima', 'selesai'];
    if (order.deliveryOption === 'delivery' && shippedStatuses.includes(currentStatus)) {
      steps.push({ status: 'dalam_pengiriman', label: 'Dalam Pengiriman', time: currentStatus === 'dalam_pengiriman' ? formatDate(rawUpdatedAt) : 'Sesuai jadwal', active: true, isCurrent: currentStatus === 'dalam_pengiriman' });
    }

    if (currentStatus === 'diterima' || currentStatus === 'selesai') {
      const label = order.deliveryOption === 'pickup' && currentStatus === 'diterima' ? 'Siap Diambil / Diterima' : (currentStatus === 'diterima' ? 'Diterima Pelanggan' : 'Selesai');
      steps.push({ status: currentStatus, label: label, time: formatDate(rawUpdatedAt), active: true, isCurrent: true });
    }
    
    if (['failed', 'canceled', 'expired', 'deny'].includes(currentStatus)){
        steps.push({ status: currentStatus, label: getStatusText(currentStatus), time: formatDate(rawUpdatedAt), active: true, isCurrent: true });
    }

    const activeOrCurrentLabels = new Set(steps.map(s => s.label));
    const baseLabelsBeforeCurrent: Record<string, string[]> = {
        'selesai': ['Lunas', 'Dikemas', order.deliveryOption === 'delivery' ? 'Dalam Pengiriman' : undefined, 'Diterima Pelanggan'].filter(Boolean) as string[],
        'diterima': ['Lunas', 'Dikemas', order.deliveryOption === 'delivery' ? 'Dalam Pengiriman' : undefined].filter(Boolean) as string[],
        'dalam_pengiriman': ['Lunas', 'Dikemas'],
        'dikemas': ['Lunas'],
    };

    const precedingStepsForCurrent = baseLabelsBeforeCurrent[currentStatus as keyof typeof baseLabelsBeforeCurrent] || [];
    
    precedingStepsForCurrent.forEach(label => {
        if(!activeOrCurrentLabels.has(label)){
            const statusKey = Object.keys(baseLabelsBeforeCurrent).find(key => baseLabelsBeforeCurrent[key as keyof typeof baseLabelsBeforeCurrent].includes(label)) || 'lunas';
             steps.unshift({status: statusKey, label: label, time: "Sesuai jadwal", active: true, isCurrent: false });
        }
    });
    
    const uniqueSteps = Array.from(new Map(steps.map(step => [step.label, step])).values())
                           .sort((a,b) => {
                               const orderSort = ['Pesanan Dibuat', 'Menunggu Pembayaran', 'Lunas', 'Dikemas', 'Dalam Pengiriman', 'Diterima Pelanggan', 'Siap Diambil / Diterima', 'Selesai'];
                               return orderSort.indexOf(a.label) - orderSort.indexOf(b.label);
                           });

    return uniqueSteps;
  };

  // The rest of the JSX (return statement) remains the same as in the previous response.
  // Ensure you copy the full JSX for the component from the previous correct answer.
  // This response focuses only on the TypeScript interface and usePage correction.

  if (selectedOrderId && selectedOrderData) {
    const orderForDetail = selectedOrderData;
    const trackingStepsToDisplay = getDynamicTrackingSteps(orderForDetail);

    return (
      <AppTemplate>
        <div className="bg-green-700 text-white py-6 relative">
          <div className="px-4 flex items-center">
            <ChevronLeft size={24} className="cursor-pointer absolute left-4" onClick={() => setSelectedOrderId(null)} />
            <h1 className="text-2xl font-bold text-center w-full">Detail Pesanan</h1>
          </div>
        </div>

        <div className="w-full mt-8 px-4 space-y-6 pb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="mb-4">
              <h2 className="text-lg font-medium mb-1">No. Pesanan:</h2>
              <p className="text-gray-800 text-lg font-semibold">{orderForDetail.orderNumber}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <h3 className="text-xl font-medium text-green-700">{orderForDetail.service}</h3>
                <p className="text-sm text-gray-500">Kurir: {orderForDetail.courier}</p>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <div className="flex items-center justify-start sm:justify-end">
                    {getStatusIcon(orderForDetail.status)}
                    <span className="ml-2 text-gray-700 font-medium">
                        {getStatusText(orderForDetail.status)}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Update Terakhir: {orderForDetail.statusTime}</p>
              </div>
            </div>
             <div className="mt-3 text-sm">
                <p><span className="text-gray-500">Tanggal Pesan:</span> {orderForDetail.createdAt}</p>
                <p><span className="text-gray-500">Metode Pembayaran:</span> {orderForDetail.paymentMethod}</p>
            </div>
          </div>

          {trackingStepsToDisplay.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4">Status Pengiriman / Pesanan</h3>
              <div className="space-y-6">
                {trackingStepsToDisplay.map((step, index) => (
                  <div key={step.status + index} className={`flex items-start ${step.active ? '' : 'opacity-50'}`}>
                    <div className="flex flex-col items-center mr-4">
                      <div className={`p-3 rounded-full ${step.active ? (step.isCurrent ? 'bg-green-500 text-white' : 'bg-green-100') : 'bg-gray-100'}`}>
                        {getStatusIcon(step.status as DeliveryOrder['status'])}
                      </div>
                      {index < trackingStepsToDisplay.length - 1 && (
                        <div className={`w-px h-12 mt-2 ${step.active ? 'bg-green-300' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                    <div className="flex-grow pt-1">
                      <h4 className={`text-lg font-medium ${step.active ? 'text-gray-800' : 'text-gray-500'}`}>{step.label}</h4>
                      {step.time && <p className="text-gray-600 text-sm">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-medium mb-4">Detail Item Pesanan</h3>
            <div className="space-y-4">
              {orderForDetail.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <Package size={20} className="text-gray-400" /> {/* Placeholder icon */}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-500">(@ {formatCurrency(item.price)})</p>}
                  </div>
                </div>
              ))}
              {orderForDetail.shippingCost && orderForDetail.shippingCost > 0 && (
                <div className="flex justify-between items-center py-2 border-b text-gray-700">
                    <span>Ongkos Kirim</span>
                    <span>{formatCurrency(orderForDetail.shippingCost)}</span>
                </div>
              )}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">Total Pesanan</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(orderForDetail.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {(orderForDetail.shippingAddress || orderForDetail.notes || authUser) && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4">Informasi Tambahan</h3>
              <div className="space-y-3 text-sm">
                {authUser && (
                  <>
                    <div>
                      <p className="text-gray-500">Nama Penerima/Pemesan</p>
                      <p className="font-medium text-gray-800">{authUser.username}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{authUser.email}</p>
                    </div>
                     {authUser.contact?.phone && (
                        <div>
                            <p className="text-sm text-gray-500">Telepon</p>
                            <p className="font-medium text-gray-800">{authUser.contact.phone}</p>
                        </div>
                    )}
                  </>
                )}
                {orderForDetail.deliveryOption === 'delivery' && orderForDetail.shippingAddress && (
                  <div>
                    <p className="text-gray-500">Alamat Pengiriman</p>
                    <p className="font-medium text-gray-800 whitespace-pre-line">{orderForDetail.shippingAddress}</p>
                  </div>
                )}
                {orderForDetail.deliveryOption === 'pickup' && (
                     <div>
                        <p className="text-gray-500">Opsi Pengambilan</p>
                        <p className="font-medium text-gray-800">Akan diambil di toko oleh pelanggan.</p>
                    </div>
                )}
                {orderForDetail.notes && (
                  <div>
                    <p className="text-gray-500">Catatan Pesanan</p>
                    <p className="font-medium text-gray-800 whitespace-pre-line">{orderForDetail.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
             <div className="text-center mt-6">
                <button
                    onClick={() => setSelectedOrderId(null)}
                    className="text-green-600 hover:text-green-700 font-medium"
                >
                    &larr; Kembali ke Daftar Pesanan
                </button>
            </div>
        </div>
      </AppTemplate>
    );
  }

  // Main list view (Pesanan / Riwayat Tabs)
  return (
    <AppTemplate>
      <div className="bg-green-700 text-white py-6 relative">
        <div className="px-4 flex items-center">
          <h1 className="text-2xl font-bold text-center w-full">
            {activeTab === 'pesanan' ? 'Pesanan Saya' : 'Riwayat Pesanan'}
          </h1>
        </div>
      </div>

      <div className="w-full mt-8 px-4 pb-8">
        <div className="flex border-b">
          <div className="flex items-center mb-4 cursor-pointer mr-8" onClick={() => setActiveTab('pesanan')}>
            <div className="p-2 rounded-full border bg-white mr-3">
              <ShoppingCart size={24} className={activeTab === 'pesanan' ? 'text-green-600' : 'text-gray-500'} />
            </div>
            <span className={`text-xl font-medium ${activeTab === 'pesanan' ? 'text-green-600 border-b-2 border-green-600 pb-1' : 'text-gray-500'}`}>
              Pesanan Aktif
            </span>
          </div>
          <div className="flex items-center mb-4 cursor-pointer" onClick={() => setActiveTab('riwayat')}>
            <div className="p-2 rounded-full border bg-white mr-3">
              <Clock size={24} className={activeTab === 'riwayat' ? 'text-green-600' : 'text-gray-500'} />
            </div>
            <span className={`text-xl font-medium ${activeTab === 'riwayat' ? 'text-green-600 border-b-2 border-green-600 pb-1' : 'text-gray-500'}`}>
              Riwayat
            </span>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'pesanan' && (
            <div className="space-y-4">
              {activeDisplayOrders.length > 0 ? (
                activeDisplayOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOrderId(order.id)}>
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                          <p className="text-xs text-gray-500">No. Pesanan</p>
                          <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                        </div>
                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                          <div className="flex items-center justify-start sm:justify-end">
                            {getStatusIcon(order.status)}
                            <span className="ml-2 text-gray-700 font-medium">
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{order.statusTime}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                        <div className="mb-3 sm:mb-0">
                          <h3 className="font-medium text-gray-800">{order.service} <span className="text-sm text-gray-500">({order.courier})</span></h3>
                           {order.items.slice(0, 2).map((item, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.name} {index === 0 && order.items.length > 1 && ', ...'}
                            </p>
                          ))}
                          {order.items.length === 0 && <p className="text-sm text-gray-500">Tidak ada item.</p>}
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-green-600 font-semibold text-lg mb-1">
                            {formatCurrency(order.total)}
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}>
                            Lihat Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow">
                  <Package size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-xl">Anda belum memiliki pesanan aktif.</p>
                  <p>Silakan buat pesanan baru untuk melihatnya di sini.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'riwayat' && (
             <div className="space-y-4">
              {historicalDisplayOrders.length > 0 ? (
                historicalDisplayOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOrderId(order.id)}>
                     <div className="p-4 border-b bg-gray-50">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                          <p className="text-xs text-gray-500">No. Pesanan</p>
                          <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                        </div>
                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                          <div className="flex items-center justify-start sm:justify-end">
                            {getStatusIcon(order.status)}
                            <span className="ml-2 text-gray-700 font-medium">
                              {getStatusText(order.status)}
                            </span>
                          </div>
                           <p className="text-xs text-gray-500 mt-1">{order.statusTime}</p>
                        </div>
                      </div>
                    </div>
                     <div className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                        <div className="mb-3 sm:mb-0">
                          <h3 className="font-medium text-gray-800">{order.service} <span className="text-sm text-gray-500">({order.courier})</span></h3>
                           {order.items.slice(0, 2).map((item, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.name} {index === 0 && order.items.length > 1 && ', ...'}
                            </p>
                          ))}
                           {order.items.length === 0 && <p className="text-sm text-gray-500">Tidak ada item.</p>}
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-gray-700 font-semibold text-lg mb-1">
                            {formatCurrency(order.total)}
                          </div>
                          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50" onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}>
                            Lihat Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow">
                  <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-xl">Riwayat pesanan Anda kosong.</p>
                  <p>Semua pesanan yang telah selesai atau dibatalkan akan muncul di sini.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppTemplate>
  );
};

export default PesananSaya;