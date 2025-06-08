// PesananSaya.tsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, User as UserIconLucide, Clock, ChevronLeft, Package, Truck, CheckCircle, DollarSign, AlertCircle, XCircle, Archive, Printer, Info, CalendarClock, Navigation, Phone, MapPin } from 'lucide-react';
import AppTemplate from "@/components/templates/app-template"; // Ensure this path is correct
import { usePage, router } from '@inertiajs/react';
import { PageProps as InertiaBasePageProps } from '@inertiajs/core';

// --- User Interface ---
interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string | null;
    contact?: {
        phone?: string | null;
        addresses?: BackendAddress[];
    };
}

interface AuthProps {
    user: User | null;
}

// --- Backend Data Structures ---
interface BackendItem {
    id: number;
    name: string;
    unit?: string;
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
    shipping_number?: string | null;
    pickup_deadline?: string | null;    // ISO string from backend
    user_marked_received_at?: string | null; // ISO string from backend
}

// --- Frontend Display Structures ---
interface DeliveryOrderItem { // Definition for DeliveryOrderItem
    name: string;
    quantity: number;
    price: number; // Price per unit after discount
}

interface DeliveryOrder {
    id: string; // Transaction ID
    orderNumber: string;
    service: string;
    courier: string;
    status: BackendTransaction['status'];
    statusTime: string; // Formatted updated_at
    items: DeliveryOrderItem[]; // Usage of DeliveryOrderItem
    total: number;
    deliveryOption?: 'delivery' | 'pickup';
    shippingAddress?: string | null;
    notes?: string | null;
    createdAt?: string; // Formatted created_at
    updatedAt?: string; // Formatted updated_at
    paymentMethod?: string;
    shippingCost?: number;
    rawCreatedAt: string;
    rawUpdatedAt: string;
    shippingNumber?: string | null;
    pickupDeadline?: string | null;    // Formatted for display
    userMarkedReceivedAt?: string | null; // Formatted for display
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string | undefined;
}

interface PesananSayaPageProps extends InertiaBasePageProps {
    activeOrders: BackendTransaction[];
    historicalOrders: BackendTransaction[];
    auth: AuthProps;
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
}

const STORE_CONTACT_INFO = {
    name: "Roni Bakery",
    address: "Jl. Raya Telang No.1, Telang indah, Kamal, Bangkalan",
    phone: "085708654651",
    operationalHours: "Setiap Hari: 08:00 - 20:00 WIB",
    googleMapsLink: "https://maps.app.goo.gl/FaYpfXLARxjj1dmN9"
};


const PesananSaya: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pesanan' | 'riwayat'>('pesanan');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isCompletingOrder, setIsCompletingOrder] = useState(false);
    const [localFlash, setLocalFlash] = useState<{ success?: string; error?: string } | null>(null);


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
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount).replace(/\s*IDR\s*/, 'Rp ');
    };

    const formatDate = (dateString?: string | null, options?: Intl.DateTimeFormatOptions): string => {
        if (!dateString) return 'N/A';
        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
        };
        try {
            return new Date(dateString).toLocaleString('id-ID', { ...defaultOptions, ...options });
        } catch (e) {
            console.warn("Invalid date string for formatting:", dateString);
            return 'Invalid Date';
        }
    };

    const transformTransactionToDisplayOrder = (transaction: BackendTransaction): DeliveryOrder => {
        const items = transaction.details.map(detail => { // This map produces DeliveryOrderItem[]
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
            courier = 'Kurir Toko';
        } else if (transaction.delivery_option === 'pickup') {
            service = 'Pickup ke Toko';
            courier = 'Diambil Pelanggan';
        }

        let shippingAddressSummary = null;
        if (transaction.delivery_option === 'delivery' && transaction.address) {
            const addr = transaction.address;
            shippingAddressSummary = [addr.street, addr.more, addr.city, addr.province, addr.post_code, addr.country].filter(Boolean).join(', ');
        }

        return {
            id: String(transaction.id),
            orderNumber: transaction.order_number_display || `RB-${transaction.id}-${new Date(transaction.created_at).getTime()}`,
            service,
            courier,
            status: transaction.status,
            statusTime: formatDate(transaction.updated_at),
            items, // items is of type DeliveryOrderItem[]
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
            shippingNumber: transaction.shipping_number || null,
            pickupDeadline: transaction.pickup_deadline ? formatDate(transaction.pickup_deadline) : null,
            userMarkedReceivedAt: transaction.user_marked_received_at ? formatDate(transaction.user_marked_received_at) : null,
            clientName: authUser?.username,
            clientEmail: authUser?.email,
            clientPhone: authUser?.contact?.phone ?? undefined,
        };
    };

    const activeDisplayOrders: DeliveryOrder[] = rawActiveOrders.map(transformTransactionToDisplayOrder);
    const historicalDisplayOrders: DeliveryOrder[] = rawHistoricalOrders.map(transformTransactionToDisplayOrder);

    const selectedOrderData = selectedOrderId
        ? [...activeDisplayOrders, ...historicalDisplayOrders].find(o => o.id === selectedOrderId)
        : null;

    const handleMarkAsReceived = (orderId: string) => {
        if (!orderId || isCompletingOrder) return;
        setIsCompletingOrder(true);
        // @ts-ignore
        router.post(route('client.orders.markReceived', { transaction: orderId }), {}, {
            onSuccess: (pageWithFlash) => {
                // @ts-ignore
                const newFlash = pageWithFlash.props.flash;
                if (newFlash) setLocalFlash(newFlash);
                setSelectedOrderId(null);
            },
            onError: (formErrors) => {
                console.error("Failed to mark order as received:", formErrors);
                const errorMessage = Object.values(formErrors).join(' ') || "Gagal menandai pesanan sebagai diterima.";
                setLocalFlash({ error: errorMessage });
            },
            onFinish: () => {
                setIsCompletingOrder(false);
            }
        });
    };

    const handlePrintReceipt = (orderId: string) => {
        if (!orderId) return;
        // @ts-ignore
        window.open(route('client.orders.receipt', { transaction: orderId }), '_blank');
    };

    const getStatusIcon = (status: DeliveryOrder['status']) => {
        switch (status) {
            case 'selesai':
            case 'diterima':
            case 'paid':
            case 'settlement':
                return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />;
            case 'dalam_pengiriman':
                return <Truck className="w-5 h-5 sm:w-6 sm:h-6" />;
            case 'dikemas':
                return <Package className="w-5 h-5 sm:w-6 sm:h-6" />;
            case 'pending':
            case 'capture':
            case 'challenge':
                return <Clock className="w-5 h-5 sm:w-6 sm:h-6" />;
            case 'failed':
            case 'deny':
                return <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />;
            case 'cancel':
            case 'canceled':
            case 'expire':
                return <Archive className="w-5 h-5 sm:w-6 sm:h-6" />;
            default:
                return <Package className="w-5 h-5 sm:w-6 sm:h-6" />;
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
            'canceled': 'Dibatalkan',
            'failed': 'Gagal',
            'dikemas': 'Dikemas / Siap Diambil',
            'dalam_pengiriman': 'Dalam Pengiriman',
            'diterima': 'Diterima Pelanggan',
            'selesai': 'Selesai',
        };
        return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
    };

    const getStatusColorClass = (status: DeliveryOrder['status'], type: 'text' | 'bg' | 'border' = 'text') => {
        let colorClass = '';
        switch (status) {
            case 'selesai':
            case 'diterima':
            case 'paid':
            case 'settlement':
                colorClass = 'green';
                break;
            case 'dalam_pengiriman':
                colorClass = 'blue';
                break;
            case 'dikemas':
                colorClass = 'indigo';
                break;
            case 'pending':
            case 'capture':
            case 'challenge':
                colorClass = 'yellow';
                break;
            case 'failed':
            case 'deny':
                colorClass = 'red';
                break;
            case 'cancel':
            case 'canceled':
            case 'expire':
                colorClass = 'gray';
                break;
            default:
                colorClass = 'gray';
        }
        if (type === 'text') return `text-${colorClass}-600`;
        if (type === 'bg') return `bg-${colorClass}-100`;
        if (type === 'border') return `border-${colorClass}-400`;
        return '';
    };

    const getDynamicTrackingSteps = (order: DeliveryOrder | null) => {
        if (!order) return [];

        const steps: Array<{ statusKey: string; label: string; time: string; active: boolean; isCurrent: boolean; color: string }> = [];
        const { status: currentStatus, rawCreatedAt, rawUpdatedAt, paymentMethod, deliveryOption, userMarkedReceivedAt, pickupDeadline, createdAt } = order;

        steps.push({ statusKey: 'created', label: 'Pesanan Dibuat', time: createdAt || formatDate(rawCreatedAt), active: true, isCurrent: false, color: 'gray' });

        const paidStatusesBackend: BackendTransaction['status'][] = ['paid', 'settlement', 'dikemas', 'dalam_pengiriman', 'diterima', 'selesai'];
        const awaitingPaymentStatusesBackend: BackendTransaction['status'][] = ['pending', 'capture', 'challenge'];
        const failedPaymentStatusesBackend: BackendTransaction['status'][] = ['failed', 'deny', 'expire', 'cancel', 'canceled'];


        if (paidStatusesBackend.includes(currentStatus) || (paymentMethod === 'Free Order' && !awaitingPaymentStatusesBackend.includes(currentStatus) && !failedPaymentStatusesBackend.includes(currentStatus))) {
            let paidTime = rawCreatedAt;
            if (currentStatus === 'paid' || currentStatus === 'settlement') {
                paidTime = rawUpdatedAt;
            }
            steps.push({ statusKey: 'paid', label: 'Pembayaran Lunas', time: formatDate(paidTime), active: true, isCurrent: currentStatus === 'paid' || currentStatus === 'settlement', color: 'green' });
        } else if (awaitingPaymentStatusesBackend.includes(currentStatus)) {
            steps.push({ statusKey: 'pending', label: getStatusText(currentStatus), time: formatDate(rawUpdatedAt), active: true, isCurrent: true, color: 'yellow' });
        } else if (failedPaymentStatusesBackend.includes(currentStatus)) {
            steps.push({ statusKey: currentStatus, label: getStatusText(currentStatus), time: formatDate(rawUpdatedAt), active: true, isCurrent: true, color: 'red' });
        }

        const packedStatusesBackend: BackendTransaction['status'][] = ['dikemas', 'dalam_pengiriman', 'diterima', 'selesai'];
        if (packedStatusesBackend.includes(currentStatus)) {
            let packedTime = 'Sesuai jadwal internal';
            if (currentStatus === 'dikemas') packedTime = formatDate(rawUpdatedAt);
            // else if (paidStatusesBackend.includes(currentStatus)) packedTime = formatDate(rawCreatedAt); // This might not be accurate for 'dikemas' if payment was much earlier

            steps.push({ statusKey: 'dikemas', label: 'Pesanan Dikemas', time: packedTime, active: true, isCurrent: currentStatus === 'dikemas', color: 'indigo' });
        }

        if (deliveryOption === 'delivery') {
            const shippedStatusesBackend: BackendTransaction['status'][] = ['dalam_pengiriman', 'diterima', 'selesai'];
            if (shippedStatusesBackend.includes(currentStatus)) {
                let shippedTime = 'Sesuai jadwal kurir';
                if (currentStatus === 'dalam_pengiriman') shippedTime = formatDate(rawUpdatedAt);
                // else if (currentStatus === 'diterima' || currentStatus === 'selesai') shippedTime = formatDate(rawUpdatedAt); // This is covered by 'diterima' step
                steps.push({ statusKey: 'dalam_pengiriman', label: 'Dalam Pengiriman', time: shippedTime, active: true, isCurrent: currentStatus === 'dalam_pengiriman', color: 'blue' });
            }
        } else if (deliveryOption === 'pickup' && (currentStatus === 'dikemas' || currentStatus === 'diterima' || currentStatus === 'selesai')) {
            steps.push({ statusKey: 'ready_pickup', label: 'Siap Diambil', time: formatDate(order.rawUpdatedAt) + (pickupDeadline ? ` (Sebelum ${pickupDeadline})` : ''), active: true, isCurrent: currentStatus === 'dikemas', color: 'purple' });
        }

        if (currentStatus === 'diterima' || currentStatus === 'selesai') {
            const receivedTime = userMarkedReceivedAt ? userMarkedReceivedAt : ((currentStatus === 'diterima' || currentStatus === 'selesai') ? formatDate(rawUpdatedAt) : 'Belum diterima');
            const receivedLabel = deliveryOption === 'pickup' ? 'Pesanan Diambil' : 'Pesanan Diterima';
            steps.push({ statusKey: 'diterima', label: receivedLabel, time: receivedTime, active: true, isCurrent: currentStatus === 'diterima', color: 'green' });

            if (currentStatus === 'selesai') {
                steps.push({ statusKey: 'selesai', label: 'Pesanan Selesai', time: formatDate(rawUpdatedAt), active: true, isCurrent: currentStatus === 'selesai', color: 'green' });
            }
        }

        const uniqueStepsMap = new Map<string, typeof steps[0]>();
        steps.forEach(step => {
            const existing = uniqueStepsMap.get(step.label);
            if (!existing || (step.isCurrent && !existing.isCurrent) || (step.active && !existing.active && !existing.isCurrent)) {
                uniqueStepsMap.set(step.label, step);
            } else if (existing && !step.isCurrent && !existing.isCurrent && step.time !== 'N/A' && existing.time !== 'N/A') {
                try {
                    if (new Date(step.time) > new Date(existing.time)) {
                        uniqueStepsMap.set(step.label, step);
                    }
                } catch (e) { }
            }
        });

        const finalSteps = Array.from(uniqueStepsMap.values());
        const statusOrder = ['created', 'pending', 'paid', 'dikemas', 'ready_pickup', 'dalam_pengiriman', 'diterima', 'selesai', 'failed', 'canceled', 'expire', 'deny'];
        finalSteps.sort((a, b) => {
            const indexA = statusOrder.indexOf(a.statusKey);
            const indexB = statusOrder.indexOf(b.statusKey);
            if (indexA === -1 && indexB === -1) return 0; // Both not in order, maintain relative
            if (indexA === -1) return 1; // A not in order, B is
            if (indexB === -1) return -1; // B not in order, A is
            return indexA - indexB;
        });

        let hasCurrentMarked = finalSteps.some(step => step.isCurrent);
        if (!hasCurrentMarked) {
            for (let i = finalSteps.length - 1; i >= 0; i--) {
                if (finalSteps[i].active) {
                    finalSteps[i].isCurrent = true;
                    break;
                }
            }
        } else {
            // Ensure only one step is marked as current if multiple qualified
            let foundFirstCurrent = false;
            for (let i = finalSteps.length - 1; i >= 0; i--) {
                if (finalSteps[i].isCurrent) {
                    if (foundFirstCurrent) {
                        finalSteps[i].isCurrent = false;
                    }
                    foundFirstCurrent = true;
                }
            }
        }
        return finalSteps;
    };


    if (selectedOrderId && selectedOrderData) {
        const orderForDetail = selectedOrderData;
        const trackingStepsToDisplay = getDynamicTrackingSteps(orderForDetail);
        const canMarkAsReceived = (orderForDetail.status === 'dalam_pengiriman' && orderForDetail.deliveryOption === 'delivery') ||
            (orderForDetail.status === 'dikemas' && orderForDetail.deliveryOption === 'pickup');

        return (
            <AppTemplate>
                {localFlash?.success && (
                    <div className="mx-4 my-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-sm print:hidden">
                        {localFlash.success}
                    </div>
                )}
                {localFlash?.error && (
                    <div className="mx-4 my-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm print:hidden">
                        {localFlash.error}
                    </div>
                )}

                <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-5 px-4 sm:px-6 relative print:hidden shadow-md">
                    <button onClick={() => setSelectedOrderId(null)} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-green-100 transition-colors duration-200">
                        <ChevronLeft size={28} />
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-center">Detail Pesanan</h1>
                </div>

                <div className="w-full mt-4 sm:mt-6 px-4 sm:px-6 space-y-5 sm:space-y-7 pb-8">
                    {/* Order Summary Card */}
                    <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">No. Pesanan</p>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">{orderForDetail.orderNumber}</h2>
                            </div>
                            <div className="text-right">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColorClass(orderForDetail.status, 'bg')} ${getStatusColorClass(orderForDetail.status, 'text')}`}>
                                    {getStatusIcon(orderForDetail.status)}
                                    <span className="ml-2">{getStatusText(orderForDetail.status)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Update: {orderForDetail.statusTime}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm sm:text-base border-t border-gray-200 pt-4 mt-4">
                            <div>
                                <p className="text-gray-500">Layanan:</p>
                                <p className="font-semibold text-gray-800">{orderForDetail.service}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Kurir:</p>
                                <p className="font-semibold text-gray-800">{orderForDetail.courier}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Tanggal Pesan:</p>
                                <p className="font-semibold text-gray-800">{orderForDetail.createdAt}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Metode Pembayaran:</p>
                                <p className="font-semibold text-gray-800">{orderForDetail.paymentMethod}</p>
                            </div>
                            {orderForDetail.shippingNumber && (
                                <div className="col-span-full">
                                    <p className="text-gray-500">No. Pengiriman:</p>
                                    <p className="font-semibold text-blue-600">{orderForDetail.shippingNumber}</p>
                                </div>
                            )}
                            {orderForDetail.deliveryOption === 'delivery' && (
                                <div className="col-span-full flex items-center text-xs sm:text-sm text-blue-700 bg-blue-50 p-3 rounded-lg mt-2">
                                    <Info size={18} className="mr-2 flex-shrink-0" />
                                    <span>Estimasi pengiriman sekitar 1-2 jam setelah pesanan dikirim oleh toko (tergantung jarak).</span>
                                </div>
                            )}
                            {orderForDetail.deliveryOption === 'pickup' && orderForDetail.pickupDeadline && (
                                <div className="col-span-full flex items-center text-xs sm:text-sm text-indigo-700 bg-indigo-50 p-3 rounded-lg mt-2">
                                    <CalendarClock size={18} className="mr-2 flex-shrink-0" />
                                    <span>Harap ambil pesanan sebelum: <span className="font-semibold">{orderForDetail.pickupDeadline}</span></span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 print:hidden">
                        <button
                            onClick={() => handlePrintReceipt(orderForDetail.id)}
                            className="w-full flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base transition-colors duration-200 shadow-md"
                        >
                            <Printer size={20} className="mr-2" /> Print Struk
                        </button>
                        {canMarkAsReceived && (
                            <button
                                onClick={() => handleMarkAsReceived(orderForDetail.id)}
                                disabled={isCompletingOrder}
                                className="w-full flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base transition-colors duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <CheckCircle size={20} className="mr-2" /> {isCompletingOrder ? 'Memproses...' : 'Tandai Sudah Diterima'}
                            </button>
                        )}
                    </div>

                    {/* Order Tracking Timeline */}
                    {trackingStepsToDisplay.length > 0 && (
                        <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border border-gray-100">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">Lacak Pesanan</h3>
                            <div className="relative border-l-2 border-gray-200 ml-3 sm:ml-5 pb-2">
                                {trackingStepsToDisplay.map((step, index) => (
                                    <div key={step.label + index} className={`mb-8 flex items-center ${step.active ? '' : 'opacity-60'}`}>
                                        <div className={`absolute -left-3.5 sm:-left-4 p-1.5 sm:p-2 rounded-full z-10 
                                            ${step.active ? (step.isCurrent ? 'bg-green-600 text-white shadow-md' : `bg-${step.color}-100 text-${step.color}-700 border-2 border-${step.color}-300`) : 'bg-gray-100 text-gray-400 border border-gray-300'}`}>
                                            {getStatusIcon(step.statusKey as DeliveryOrder['status'])}
                                        </div>
                                        <div className={`flex-grow ml-8 sm:ml-10 p-3 rounded-lg w-full ${step.isCurrent ? 'bg-green-50' : ''}`}>
                                            <h4 className={`text-sm sm:text-base font-semibold ${step.active ? (step.isCurrent ? 'text-green-700' : 'text-gray-800') : 'text-gray-500'}`}>{step.label}</h4>
                                            {step.time && <p className="text-xs sm:text-sm text-gray-600 mt-1">{step.time}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Order Items Detail */}
                    <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">Detail Item Pesanan</h3>
                        <div className="space-y-4">
                            {orderForDetail.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                            <Package size={24} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</h4>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{formatCurrency(item.price * item.quantity)}</p>
                                        {item.quantity > 1 && <p className="text-2xs sm:text-xs text-gray-500 mt-0.5">(@ {formatCurrency(item.price)})</p>}
                                    </div>
                                </div>
                            ))}
                            {orderForDetail.shippingCost !== undefined && orderForDetail.shippingCost > 0 && (
                                <div className="flex justify-between items-center pt-3 text-gray-700 text-sm sm:text-base">
                                    <span>Ongkos Kirim</span>
                                    <span className="font-medium">{formatCurrency(orderForDetail.shippingCost)}</span>
                                </div>
                            )}
                            <div className="pt-4 border-t border-gray-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-md sm:text-lg font-bold text-gray-800">Total Pesanan</span>
                                    <span className="text-lg sm:text-xl font-extrabold text-green-700">{formatCurrency(orderForDetail.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Delivery Information */}
                    <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">Informasi Pelanggan & Pengiriman</h3>
                        <div className="space-y-4 text-sm sm:text-base">
                            {authUser && (
                                <>
                                    <div>
                                        <p className="text-gray-500 flex items-center"><UserIconLucide size={16} className="mr-2 text-gray-400" /> Nama Penerima/Pemesan</p>
                                        <p className="font-medium text-gray-800 mt-1">{authUser.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 flex items-center"><Clock size={16} className="mr-2 text-gray-400" /> Email</p>
                                        <p className="font-medium text-gray-800 mt-1">{authUser.email}</p>
                                    </div>
                                    {authUser.contact?.phone && (
                                        <div>
                                            <p className="text-gray-500 flex items-center"><Phone size={16} className="mr-2 text-gray-400" /> Telepon</p>
                                            <p className="font-medium text-gray-800 mt-1">{authUser.contact.phone}</p>
                                        </div>
                                    )}
                                </>
                            )}
                            {orderForDetail.deliveryOption === 'delivery' && orderForDetail.shippingAddress && (
                                <div>
                                    <p className="text-gray-500 flex items-center"><MapPin size={16} className="mr-2 text-gray-400" /> Alamat Pengiriman</p>
                                    <p className="font-medium text-gray-800 whitespace-pre-line mt-1">{orderForDetail.shippingAddress}</p>
                                </div>
                            )}
                            {orderForDetail.deliveryOption === 'pickup' && (
                                <div>
                                    <p className="text-gray-500 flex items-center"><Archive size={16} className="mr-2 text-gray-400" /> Opsi Pengambilan</p>
                                    <p className="font-medium text-gray-800 mt-1">Akan diambil di toko oleh pelanggan.</p>
                                    {orderForDetail.pickupDeadline && <p className="text-indigo-700 mt-1">Mohon diambil sebelum: {orderForDetail.pickupDeadline}</p>}
                                </div>
                            )}
                            {orderForDetail.notes && orderForDetail.notes.replace(/Delivery to:.*?\n---\n|Pickup from store.\n---\n/g, '').trim() !== '' && (
                                <div>
                                    <p className="text-gray-500 flex items-center"><Info size={16} className="mr-2 text-gray-400" /> Catatan Pesanan</p>
                                    <p className="font-medium text-gray-800 whitespace-pre-line mt-1">{orderForDetail.notes.replace(/Delivery to:.*?\n---\n|Pickup from store.\n---\n/g, '')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Store Information */}
                    <div className="bg-white rounded-xl p-5 sm:p-7 shadow-lg border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">Informasi Toko</h3>
                        <div className="space-y-3 text-sm sm:text-base">
                            <div>
                                <p className="font-bold text-gray-800">{STORE_CONTACT_INFO.name}</p>
                            </div>
                            <div className="flex items-start">
                                <Navigation size={20} className="mr-3 text-gray-500 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-700 leading-relaxed">
                                    {STORE_CONTACT_INFO.address}
                                    <a href={STORE_CONTACT_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline ml-1">
                                        (Lihat Peta)
                                    </a>
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Phone size={20} className="mr-3 text-gray-500 flex-shrink-0" />
                                <p className="text-gray-700">{STORE_CONTACT_INFO.phone}</p>
                            </div>
                            <div className="flex items-center">
                                <Clock size={20} className="mr-3 text-gray-500 flex-shrink-0" />
                                <p className="text-gray-700">Jam Operasional: {STORE_CONTACT_INFO.operationalHours}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6 sm:mt-8 print:hidden">
                        <button
                            onClick={() => setSelectedOrderId(null)}
                            className="inline-flex items-center text-green-700 hover:text-green-800 font-medium text-base sm:text-lg transition-colors duration-200"
                        >
                            <ChevronLeft size={20} className="mr-2" /> Kembali ke Daftar Pesanan
                        </button>
                    </div>
                </div>
            </AppTemplate>
        );
    }

    return (
        <AppTemplate>
            {localFlash?.success && (
                <div className="mx-4 my-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-sm print:hidden">
                    {localFlash.success}
                </div>
            )}
            {localFlash?.error && (
                <div className="mx-4 my-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm print:hidden">
                    {localFlash.error}
                </div>
            )}

            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-5 px-4 sm:px-6 relative print:hidden shadow-md">
                <h1 className="text-xl sm:text-2xl font-bold text-center">
                    {activeTab === 'pesanan' ? 'Pesanan Saya' : 'Riwayat Pesanan'}
                </h1>
            </div>

            <div className="w-full mt-4 sm:mt-6 px-4 sm:px-6 pb-8 print:hidden">
                {/* Tabs for Active and Historical Orders */}
                <div className="flex bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8 p-1">
                    <button
                        onClick={() => setActiveTab('pesanan')}
                        className={`flex-1 flex items-center justify-center py-3 sm:py-3.5 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300
                            ${activeTab === 'pesanan' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                    >
                        <ShoppingCart size={20} className={`mr-2 ${activeTab === 'pesanan' ? 'text-white' : 'text-green-600'}`} />
                        Pesanan Aktif ({activeDisplayOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('riwayat')}
                        className={`flex-1 flex items-center justify-center py-3 sm:py-3.5 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300
                            ${activeTab === 'riwayat' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
                    >
                        <Clock size={20} className={`mr-2 ${activeTab === 'riwayat' ? 'text-white' : 'text-green-600'}`} />
                        Riwayat ({historicalDisplayOrders.length})
                    </button>
                </div>

                {/* Order List */}
                <div className="mt-6">
                    {(activeTab === 'pesanan' ? activeDisplayOrders : historicalDisplayOrders).length > 0 ? (
                        <div className="space-y-4 sm:space-y-5">
                            {(activeTab === 'pesanan' ? activeDisplayOrders : historicalDisplayOrders).map((order) => (
                                <div key={order.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-100"
                                    onClick={() => setSelectedOrderId(order.id)}
                                >
                                    <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">No. Pesanan</p>
                                                <p className="font-bold text-gray-800 text-sm sm:text-base">{order.orderNumber}</p>
                                            </div>
                                            <div className="text-left sm:text-right mt-2 sm:mt-0">
                                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold 
                                                    ${getStatusColorClass(order.status, 'bg')} ${getStatusColorClass(order.status, 'text')}`}>
                                                    {getStatusIcon(order.status)}
                                                    <span className="ml-1.5">{getStatusText(order.status)}</span>
                                                </div>
                                                <p className="text-2xs text-gray-500 mt-1">Update: {order.statusTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-5">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                                            <div className="mb-3 sm:mb-0 flex-1 pr-4">
                                                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{order.service} <span className="text-xs sm:text-sm text-gray-500">({order.courier})</span></h3>
                                                {order.items.slice(0, 2).map((item, index) => (
                                                    <p key={index} className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">
                                                        {item.quantity}x {item.name} {index === 0 && order.items.length > 1 ? ', ...' : ''}
                                                    </p>
                                                ))}
                                                {order.items.length === 0 && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Tidak ada item.</p>}
                                                {order.deliveryOption === 'pickup' && order.pickupDeadline && order.status === 'dikemas' && (
                                                    <p className="text-xs text-indigo-700 mt-2">Ambil sebelum: <span className="font-medium">{order.pickupDeadline}</span></p>
                                                )}
                                            </div>
                                            <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                                                <div className="text-green-700 font-extrabold text-md sm:text-lg mb-2">
                                                    {formatCurrency(order.total)}
                                                </div>
                                                <button
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 shadow-sm"
                                                    onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }}
                                                >
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-md border border-gray-100">
                            {activeTab === 'pesanan' ? (
                                <>
                                    <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg sm:text-xl font-semibold mb-2">Anda belum memiliki pesanan aktif.</p>
                                    <p className="text-sm sm:text-base text-gray-600 px-4">Silakan buat pesanan baru untuk melihatnya di sini.</p>
                                </>
                            ) : (
                                <>
                                    <Clock size={64} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg sm:text-xl font-semibold mb-2">Riwayat pesanan Anda kosong.</p>
                                    <p className="text-sm sm:text-base text-gray-600 px-4">Semua pesanan yang telah selesai atau dibatalkan akan muncul di sini.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppTemplate>
    );
};

export default PesananSaya;