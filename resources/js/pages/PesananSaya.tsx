import React, { useState, useEffect, JSX } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps as InertiaBasePageProps } from '@inertiajs/core';
import AppTemplate from "@/components/templates/app-template";
import {
    ShoppingCart, User as UserIconLucide, Clock, ChevronLeft, Package, Truck, CheckCircle,
    XCircle, Archive, Printer, Info, CalendarClock, Navigation, Phone, MapPin, Warehouse, Star
} from 'lucide-react';

// --- INTERFACE & TIPE DATA ---

interface User {
    id: number;
    username: string;
    email: string;
    contact?: {
        phone?: string | null;
    };
}

interface AuthProps {
    user: User | null;
}

interface BackendItem {
    id: number;
    name: string;
    unit?: string;
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

interface BackendTransactionDetail {
    id: number;
    item: BackendItem;
    quantity: number;
    price_at_time: string;
    discount_percentage_at_time: number | null;
}

// Menambahkan interface untuk Rating
interface BackendRating {
    id: number;
    item_id: number;
    transaction_id: number;
    client_id: number;
    score: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
}


interface BackendTransaction {
    id: number;
    order_number_display: string;
    client_id: number;
    total: string;
    note?: string | null;
    payment_method: string;
    status: 'pending' | 'paid' | 'settlement' | 'dikemas' | 'dalam_pengiriman' | 'diterima' | 'selesai' | string;
    delivery_status: 'menunggu' | 'diambil' | 'sedang dikirim' | 'selesai';
    delivery_option: 'delivery' | 'pickup';
    shipping_cost: string;
    address_id?: number | null;
    address?: BackendAddress | null;
    details: BackendTransactionDetail[];
    created_at: string;
    updated_at: string;
    user_marked_received_at?: string | null;
    pickup_deadline?: string | null;
    ratings?: BackendRating[]; // Menambahkan field ratings ke transaksi
}

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
    deliveryStatus: BackendTransaction['delivery_status'];
    statusTime: string;
    items: DeliveryOrderItem[];
    total: number;
    deliveryOption: 'delivery' | 'pickup';
    shippingAddress?: string | null;
    notes?: string | null;
    createdAt?: string;
    paymentMethod?: string;
    shippingCost: number;
    rawCreatedAt: string;
    rawUpdatedAt: string;
    pickupDeadline?: string | null;
    userMarkedReceivedAt?: string | null;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    ratings?: BackendRating[]; // Menambahkan field ratings ke DeliveryOrder
}

interface PesananSayaPageProps extends InertiaBasePageProps {
    activeOrders: BackendTransaction[];
    historicalOrders: BackendTransaction[];
    auth: AuthProps;
    flash?: { success?: string; error?: string };
    errors?: Record<string, string>;
}

const STORE_CONTACT_INFO = {
    name: "Roni Bakery",
    address: "Jl. Raya Telang No.1, Telang indah, Kamal, Bangkalan",
    phone: "085708654651",
    operationalHours: "Setiap Hari: 08:00 - 20:00 WIB",
    googleMapsLink: "https://maps.app.goo.gl/yourlink" // Ganti dengan link Google Maps Anda
};

const PesananSaya: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pesanan' | 'riwayat'>('pesanan');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isCompletingOrder, setIsCompletingOrder] = useState(false);
    const [localFlash, setLocalFlash] = useState<{ success?: string; error?: string } | null>(null);

    // State untuk modal review
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewScore, setReviewScore] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewingTransactionId, setReviewingTransactionId] = useState<number | null>(null);
    const [reviewingItemId, setReviewingItemId] = useState<number | null>(null);


    const page = usePage<PesananSayaPageProps>();
    const { activeOrders: rawActiveOrders, historicalOrders: rawHistoricalOrders, auth, flash } = page.props;
    const authUser = auth.user;

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setLocalFlash(flash);
            const timer = setTimeout(() => setLocalFlash(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString?: string | null): string => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
            });
        } catch (e) { return 'Invalid Date'; }
    };

    const transformTransactionToDisplayOrder = (transaction: BackendTransaction): DeliveryOrder => {
        const items = transaction.details.map(detail => {
            const priceAfterDiscount = parseFloat(detail.price_at_time) * (1 - (detail.discount_percentage_at_time || 0) / 100);
            return { name: detail.item.name, quantity: detail.quantity, price: priceAfterDiscount };
        });

        const service = transaction.delivery_option === 'delivery' ? 'Pengiriman ke Alamat' : 'Pickup di Toko';
        const courier = transaction.delivery_option === 'delivery' ? 'Kurir Toko' : 'Diambil Pelanggan';

        const addr = transaction.address;
        const shippingAddressSummary = addr ? [addr.street, addr.more, addr.city, addr.province, addr.post_code].filter(Boolean).join(', ') : undefined;

        return {
            id: String(transaction.id),
            orderNumber: transaction.order_number_display || `RB-${transaction.id}`,
            service, courier, items,
            status: transaction.status,
            deliveryStatus: transaction.delivery_status,
            statusTime: formatDate(transaction.updated_at),
            total: parseFloat(transaction.total),
            deliveryOption: transaction.delivery_option,
            shippingAddress: shippingAddressSummary,
            notes: transaction.note || undefined,
            createdAt: formatDate(transaction.created_at),
            paymentMethod: transaction.payment_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            shippingCost: parseFloat(transaction.shipping_cost),
            rawCreatedAt: transaction.created_at,
            rawUpdatedAt: transaction.updated_at,
            pickupDeadline: transaction.pickup_deadline ? formatDate(transaction.pickup_deadline) : undefined,
            userMarkedReceivedAt: transaction.user_marked_received_at ? formatDate(transaction.user_marked_received_at) : undefined,
            clientName: authUser?.username,
            clientEmail: authUser?.email,
            clientPhone: authUser?.contact?.phone || undefined,
            ratings: transaction.ratings || [], // Pastikan ratings ikut ditransform
        };
    };

    const activeDisplayOrders = rawActiveOrders.map(transformTransactionToDisplayOrder);
    const historicalDisplayOrders = rawHistoricalOrders.map(transformTransactionToDisplayOrder);

    const selectedOrderData = selectedOrderId ? [...activeDisplayOrders, ...historicalDisplayOrders].find(o => o.id === selectedOrderId) : null;

    const handleMarkAsReceived = (orderId: string) => {
        if (!orderId || isCompletingOrder) return;
        setIsCompletingOrder(true);
        router.post(route('client.orders.markReceived', { transaction: orderId }), {}, {
            onSuccess: () => {
                setSelectedOrderId(null);
                setLocalFlash({ success: "Status pesanan berhasil diperbarui menjadi Diterima/Diambil." });
            },
            onError: (errs) => setLocalFlash({ error: Object.values(errs).join(' ') || "Gagal memperbarui status." }),
            onFinish: () => setIsCompletingOrder(false),
        });
    };

    const getStatusText = (order: DeliveryOrder): string => {
        if (order.status === 'selesai') return 'Pesanan Selesai';
        if (order.status === 'diterima') return 'Pesanan Tiba';
        if (order.status === 'dalam_pengiriman' || order.deliveryStatus === 'sedang dikirim') return 'Dalam Pengiriman';
        if (order.deliveryOption === 'delivery' && order.deliveryStatus === 'diambil') return 'Diambil oleh Kurir';
        if (order.deliveryOption === 'pickup' && order.deliveryStatus === 'menunggu' && (order.status === 'paid' || order.status === 'dikemas')) return 'Siap Diambil';
        if (order.status === 'dikemas' || (order.status === 'paid' && order.deliveryStatus === 'menunggu')) return 'Pesanan Dikemas';
        const map: Record<string, string> = { 'pending': 'Menunggu Pembayaran', 'paid': 'Lunas', 'canceled': 'Dibatalkan', 'failed': 'Gagal' };
        return map[order.status] || order.status;
    };

    const getStatusIcon = (order: DeliveryOrder) => {
        if (order.status === 'selesai' || order.status === 'diterima') return <CheckCircle className="w-5 h-5" />;
        if (order.status === 'dalam_pengiriman' || order.deliveryStatus === 'sedang dikirim') return <Truck className="w-5 h-5" />;
        if (order.deliveryStatus === 'diambil' && order.deliveryOption === 'delivery') return <Warehouse className="w-5 h-5" />;
        if (order.deliveryOption === 'pickup' && order.deliveryStatus === 'menunggu' && (order.status === 'paid' || order.status === 'dikemas')) return <Archive className="w-5 h-5"/>;
        if (order.status === 'dikemas' || (order.status === 'paid' && order.deliveryStatus === 'menunggu')) return <Package className="w-5 h-5" />;
        if (order.status === 'pending') return <Clock className="w-5 h-5" />;
        return <XCircle className="w-5 h-5" />;
    };

    const getStatusColorClass = (status: string) => {
        const colors: Record<string, string> = {
            'selesai': 'green', 'diterima': 'green', 'paid': 'green', 'settlement': 'green',
            'dalam_pengiriman': 'blue', 'dikemas': 'indigo', 'pending': 'yellow',
            'failed': 'red', 'deny': 'red', 'cancel': 'gray', 'expire': 'gray'
        };
        return colors[status] || 'gray';
    };

    const handlePrintReceipt = (orderId: string) => {
        router.get(route('client.orders.receipt', { transaction: orderId }));
    };

    const getDynamicTrackingSteps = (order: DeliveryOrder) => {
        const steps: { key: string; label: string; time: string; active: boolean; isCurrent: boolean; color: string; icon: JSX.Element }[] = [];
        const { status, deliveryStatus, rawCreatedAt, rawUpdatedAt, deliveryOption, userMarkedReceivedAt, createdAt, pickupDeadline } = order;
        const isPaid = ['paid', 'settlement', 'dikemas', 'dalam_pengiriman', 'diterima', 'selesai'].includes(status);

        steps.push({ key: 'created', label: 'Pesanan Dibuat', time: createdAt || formatDate(rawCreatedAt), active: true, isCurrent: false, color: 'gray', icon: <ShoppingCart/> });

        if (isPaid) {
            steps.push({ key: 'paid', label: 'Pembayaran Lunas', time: formatDate(rawCreatedAt), active: true, color: 'green', icon: <CheckCircle/>, isCurrent: status === 'paid' && deliveryStatus === 'menunggu' });
            steps.push({ key: 'packed', label: 'Pesanan Dikemas', time: 'Sesuai jadwal internal', active: true, color: 'indigo', icon: <Package/>, isCurrent: status === 'dikemas' });
        } else { /* Logika untuk pembayaran gagal/pending */ }

        if (deliveryOption === 'delivery' && isPaid) {
            steps.push({ key: 'taken', label: 'Diserahkan ke Kurir', time: 'Menunggu dijemput kurir', active: ['diambil', 'sedang dikirim', 'selesai'].includes(deliveryStatus), color: 'blue', icon: <Warehouse/>, isCurrent: deliveryStatus === 'diambil' });
            steps.push({ key: 'shipping', label: 'Dalam Pengiriman', time: deliveryStatus === 'sedang dikirim' ? formatDate(rawUpdatedAt) : 'Menunggu status kurir', active: ['sedang dikirim', 'selesai'].includes(deliveryStatus), color: 'blue', icon: <Truck/>, isCurrent: deliveryStatus === 'sedang dikirim' });
        } else if (deliveryOption === 'pickup' && isPaid) {
            steps.push({ key: 'ready', label: 'Siap Diambil', time: pickupDeadline || 'Tersedia di toko', active: true, color: 'purple', icon: <Archive/>, isCurrent: deliveryStatus === 'menunggu' && !['diterima', 'selesai'].includes(status) });
        }

        if ((deliveryStatus === 'selesai' || ['diterima', 'selesai'].includes(status)) && isPaid) {
            const time = userMarkedReceivedAt || (status === 'diterima' ? formatDate(rawUpdatedAt) : 'Dikonfirmasi sistem');
            steps.push({ key: 'arrived', label: deliveryOption === 'pickup' ? 'Pesanan Diambil' : 'Pesanan Tiba', time, active: true, color: 'green', icon: <CheckCircle/>, isCurrent: status === 'diterima' });
        }

        if (status === 'selesai') {
            steps.push({ key: 'finished', label: 'Pesanan Selesai', time: formatDate(rawUpdatedAt), active: true, color: 'green', icon: <CheckCircle/>, isCurrent: true });
        }

        const uniqueSteps = Array.from(new Map(steps.map(s => [s.key, s])).values());
        const lastActiveCurrent = uniqueSteps.filter(s => s.isCurrent).pop();
        return uniqueSteps.map(s => ({ ...s, isCurrent: lastActiveCurrent ? s.key === lastActiveCurrent.key : false }));
    };

    // Fungsi untuk membuka modal review
    const handleOpenReviewModal = (transactionId: number, itemId: number) => {
        setReviewingTransactionId(transactionId);
        setReviewingItemId(itemId);
        setReviewScore(0);
        setReviewComment('');
        setIsReviewModalOpen(true);
    };

    // Fungsi untuk submit review
    const handleSubmitReview = () => {
        if (!reviewingTransactionId || !reviewingItemId || reviewScore === 0 || !authUser?.id) {
            setLocalFlash({ error: "Data review tidak lengkap." });
            return;
        }

        router.post(route('client.reviews.store'), {
            transaction_id: reviewingTransactionId,
            item_id: reviewingItemId,
            client_id: authUser.id,
            score: reviewScore,
            comment: reviewComment,
        }, {
            onSuccess: () => {
                setIsReviewModalOpen(false);
                setLocalFlash({ success: "Review berhasil ditambahkan!" });
                // Opsional: refresh halaman atau update data di client side
                router.reload({ preserveUrl: true });
            },
            onError: (errs) => {
                setLocalFlash({ error: Object.values(errs).join(' ') || "Gagal menambahkan review." });
            },
            onFinish: () => {
                setReviewingTransactionId(null);
                setReviewingItemId(null);
            },
        });
    };


    if (selectedOrderId && selectedOrderData) {
        const order = selectedOrderData;
        const trackingSteps = getDynamicTrackingSteps(order);
        const color = getStatusColorClass(order.status);
        const canMarkAsReceived = order.status !== 'selesai' && ((order.deliveryOption === 'delivery' && ['sedang dikirim', 'selesai'].includes(order.deliveryStatus)) || (order.deliveryOption === 'pickup' && isCompletingOrder === false && (order.status === 'paid' || order.status === 'dikemas')));
        const hasBeenReviewed = order.ratings && order.ratings.length > 0;

        return (
            <AppTemplate>
                <Head title={`Detail Pesanan ${order.orderNumber}`} />
                {localFlash?.success && <div className="m-4 p-3 bg-green-100 border-green-400 text-green-700 rounded-lg">{localFlash.success}</div>}
                {localFlash?.error && <div className="m-4 p-3 bg-red-100 border-red-400 text-red-700 rounded-lg">{localFlash.error}</div>}

                <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-5 px-4 sm:px-6 relative shadow-md">
                    <button onClick={() => setSelectedOrderId(null)} className="absolute left-4 top-1/2 -translate-y-1/2"><ChevronLeft size={28} /></button>
                    <h1 className="text-xl sm:text-2xl font-bold text-center">Detail Pesanan</h1>
                </div>

                <div className="w-full mt-4 sm:mt-6 px-4 sm:px-6 space-y-5 sm:space-y-7 pb-8">
                    {/* Order Summary */}
                    <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">No. Pesanan</p>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">{order.orderNumber}</h2>
                            </div>
                            <div className="text-right">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-${color}-100 text-${color}-600`}>
                                    {getStatusIcon(order)} <span className="ml-2">{getStatusText(order)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Update: {order.statusTime}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm sm:text-base border-t pt-4 mt-4">
                            <div><p className="text-gray-500">Layanan:</p><p className="font-semibold">{order.service}</p></div>
                            <div><p className="text-gray-500">Kurir:</p><p className="font-semibold">{order.courier}</p></div>
                            <div><p className="text-gray-500">Tanggal Pesan:</p><p className="font-semibold">{order.createdAt}</p></div>
                            <div><p className="text-gray-500">Metode Bayar:</p><p className="font-semibold">{order.paymentMethod}</p></div>
                            {order.pickupDeadline && <div className="col-span-full mt-2 flex items-center"><Info size={18} className="mr-2"/><span>Batas pengambilan: {order.pickupDeadline}</span></div>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <button onClick={() => handlePrintReceipt(order.id)} className="w-full flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"><Printer size={20} className="mr-2" /> Print Struk</button>
                        {canMarkAsReceived && <button onClick={() => handleMarkAsReceived(order.id)} disabled={isCompletingOrder} className="w-full flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-60"><CheckCircle size={20} className="mr-2" />{isCompletingOrder ? 'Memproses...' : (order.deliveryOption === 'pickup' ? 'Konfirmasi Pengambilan' : 'Tandai Diterima')}</button>}

                        {/* Tombol Beri Review */}
                        {order.status === 'selesai' && !hasBeenReviewed && order.items.length > 0 && (
                            <button
                                onClick={() => handleOpenReviewModal(parseInt(order.id), (rawHistoricalOrders.find(o => String(o.id) === order.id)?.details[0]?.item.id || 0))} // Mengambil ID item pertama dari detail transaksi
                                className="w-full flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Star size={20} className="mr-2" /> Beri Review
                            </button>
                        )}
                    </div>

                    {/* Tracking Timeline */}
                    {trackingSteps.length > 0 && <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">Lacak Pesanan</h3>
                        <div className="relative border-l-2 border-gray-200 ml-3 sm:ml-5 pb-2">
                            {trackingSteps.map(step => (
                                <div key={step.key} className={`mb-8 flex items-center ${step.active ? '' : 'opacity-60'}`}>
                                    <div className={`absolute -left-4 p-2 rounded-full z-10 ${step.isCurrent ? 'bg-green-600 text-white shadow-md' : `bg-${step.color}-100 text-${step.color}-700 border-2 border-${step.color}-300`}`}>{React.cloneElement(step.icon, { className: 'w-5 h-5' })}</div>
                                    <div className={`flex-grow ml-10 p-3 rounded-lg w-full ${step.isCurrent ? 'bg-green-50' : ''}`}>
                                        <h4 className={`text-sm sm:text-base font-semibold ${step.isCurrent ? 'text-green-700' : 'text-gray-800'}`}>{step.label}</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{step.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}

                    {/* Item Details */}
                    <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">Detail Item</h3>
                        <div className="space-y-4">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                                    <div className="flex items-center"><div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4"><Package size={24} className="text-gray-400" /></div><div><h4 className="font-medium">{item.name}</h4><p className="text-sm text-gray-600">Qty: {item.quantity}</p></div></div>
                                    <div className="text-right"><p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>{item.quantity > 1 && <p className="text-xs text-gray-500">(@ {formatCurrency(item.price)})</p>}</div>
                                </div>
                            ))}
                            {order.shippingCost > 0 && <div className="flex justify-between items-center pt-3 text-gray-700"><span>Ongkos Kirim</span><span className="font-medium">{formatCurrency(order.shippingCost)}</span></div>}
                            <div className="pt-4 border-t"><div className="flex justify-between items-center"><span className="text-lg font-bold">Total Pesanan</span><span className="text-xl font-extrabold text-green-700">{formatCurrency(order.total)}</span></div></div>
                        </div>
                    </div>

                    {/* Review Section (jika sudah ada review) */}
                    {hasBeenReviewed && (
                        <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">Review Anda</h3>
                            {order.ratings?.map((rating, index) => (
                                <div key={rating.id} className="mb-4 pb-4 border-b last:border-b-0">
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={20}
                                                className={`mr-1 ${i < rating.score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">{rating.score} / 5</span>
                                    </div>
                                    <p className="text-gray-700 text-sm italic">"{rating.comment}"</p>
                                    <p className="text-xs text-gray-500 mt-1">Diberikan pada: {formatDate(rating.created_at)}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Customer & Delivery Info */}
                    <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border">
                        <h3 className="text-lg sm:text-xl font-semibold mb-5">Info Pelanggan & Pengiriman</h3>
                        <div className="space-y-4 text-sm">
                            {order.clientName && <div><p className="text-gray-500 flex items-center"><UserIconLucide size={16} className="mr-2"/>Penerima/Pemesan</p><p className="font-medium mt-1">{order.clientName}</p></div>}
                            {order.clientEmail && <div><p className="text-gray-500 flex items-center"><Clock size={16} className="mr-2"/>Email</p><p className="font-medium mt-1">{order.clientEmail}</p></div>}
                            {order.clientPhone && <div><p className="text-gray-500 flex items-center"><Phone size={16} className="mr-2"/>Telepon</p><p className="font-medium mt-1">{order.clientPhone}</p></div>}
                            {order.deliveryOption === 'delivery' && order.shippingAddress && <div><p className="text-gray-500 flex items-center"><MapPin size={16} className="mr-2"/>Alamat Kirim</p><p className="font-medium whitespace-pre-line mt-1">{order.shippingAddress}</p></div>}
                            {order.deliveryOption === 'pickup' && <div><p className="text-gray-500 flex items-center"><Archive size={16} className="mr-2"/>Opsi Pengambilan</p><p className="font-medium mt-1">Diambil di toko.</p></div>}
                            {order.notes && <div><p className="text-gray-500 flex items-center"><Info size={16} className="mr-2"/>Catatan</p><p className="font-medium whitespace-pre-line mt-1">{order.notes}</p></div>}
                        </div>
                    </div>

                    {/* Store Info */}
                    <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border">
                        <h3 className="text-lg sm:text-xl font-semibold mb-5">Informasi Toko</h3>
                        <div className="space-y-3 text-sm">
                            <p className="font-bold">{STORE_CONTACT_INFO.name}</p>
                            <div className="flex items-start"><Navigation size={20} className="mr-3 mt-0.5"/><p>{STORE_CONTACT_INFO.address}<a href={STORE_CONTACT_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">(Lihat Peta)</a></p></div>
                            <div className="flex items-center"><Phone size={20} className="mr-3"/><p>{STORE_CONTACT_INFO.phone}</p></div>
                            <div className="flex items-center"><Clock size={20} className="mr-3"/><p>Jam Operasional: {STORE_CONTACT_INFO.operationalHours}</p></div>
                        </div>
                    </div>

                    <div className="text-center mt-6"><button onClick={() => setSelectedOrderId(null)} className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"><ChevronLeft size={20} className="mr-2" /> Kembali ke Daftar Pesanan</button></div>
                </div>

                {/* Review Modal */}
                {isReviewModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                            <h2 className="text-2xl font-bold mb-4">Beri Review Anda</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={30}
                                            className={`cursor-pointer ${i < reviewScore ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            onClick={() => setReviewScore(i + 1)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Komentar:</label>
                                <textarea
                                    id="comment"
                                    rows={4}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Tulis komentar Anda di sini..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={reviewScore === 0 || !reviewComment.trim()}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AppTemplate>
        );
    }

    return (
        <AppTemplate>
            <Head title="Pesanan Saya" />
            {localFlash?.success && <div className="m-4 p-3 bg-green-100 border-green-400 text-green-700 rounded-lg">{localFlash.success}</div>}
            {localFlash?.error && <div className="m-4 p-3 bg-red-100 border-red-400 text-red-700 rounded-lg">{localFlash.error}</div>}

            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-5 px-4 shadow-md">
                <h1 className="text-xl font-bold text-center">{activeTab === 'pesanan' ? 'Pesanan Aktif' : 'Riwayat Pesanan'}</h1>
            </div>

            <div className="w-full mt-4 sm:mt-6 px-4 sm:px-6 pb-8">
                <div className="flex bg-white rounded-xl shadow-md p-1 mb-6">
                    <button onClick={() => setActiveTab('pesanan')} className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all ${activeTab === 'pesanan' ? 'bg-green-600 text-white shadow' : 'text-gray-700 hover:bg-gray-50'}`}><ShoppingCart size={20} className="mr-2"/>Pesanan Aktif ({activeDisplayOrders.length})</button>
                    <button onClick={() => setActiveTab('riwayat')} className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all ${activeTab === 'riwayat' ? 'bg-green-600 text-white shadow' : 'text-gray-700 hover:bg-gray-50'}`}><Clock size={20} className="mr-2"/>Riwayat ({historicalDisplayOrders.length})</button>
                </div>

                <div className="mt-6">
                    {(activeTab === 'pesanan' ? activeDisplayOrders : historicalDisplayOrders).length > 0 ? (
                        <div className="space-y-4">
                            {(activeTab === 'pesanan' ? activeDisplayOrders : historicalDisplayOrders).map(order => {
                                const color = getStatusColorClass(order.status);
                                return (
                                <div key={order.id} onClick={() => setSelectedOrderId(order.id)} className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow border">
                                    <div className="p-4 sm:p-5 border-b bg-gray-50">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                            <div>
                                                <p className="text-xs text-gray-500">No. Pesanan</p>
                                                <p className="font-bold text-gray-800">{order.orderNumber}</p>
                                            </div>
                                            <div className="text-left sm:text-right mt-2 sm:mt-0">
                                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-600`}>
                                                    {getStatusIcon(order)}<span className="ml-1.5">{getStatusText(order)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Update: {order.statusTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-5">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                                            <div className="mb-3 sm:mb-0 flex-1 pr-4">
                                                <h3 className="font-semibold text-gray-800">{order.service} <span className="text-gray-500">({order.courier})</span></h3>
                                                <p className="text-sm text-gray-600 truncate mt-0.5">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                                            </div>
                                            <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                                                <div className="text-green-700 font-extrabold text-lg mb-2">{formatCurrency(order.total)}</div>
                                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm">Lihat Detail</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-md border">
                            {activeTab === 'pesanan' ? <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" /> : <Clock size={64} className="mx-auto mb-4 text-gray-300" />}
                            <p className="text-lg font-semibold mb-2">{activeTab === 'pesanan' ? 'Anda belum memiliki pesanan aktif.' : 'Riwayat pesanan Anda kosong.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </AppTemplate>
    );
};

export default PesananSaya;