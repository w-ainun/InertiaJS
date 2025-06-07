import React, { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppTemplate from '@/components/templates/app-template';
import { CheckCircle, AlertTriangle, Info, CreditCard } from 'lucide-react'; // Ditambahkan CreditCard

declare function route(name: string, params?: any): string;

interface TransactionItemDetail {
    id: number;
    name: string;
}
interface TransactionDetail {
    id: number;
    item_id: number;
    quantity: number;
    price_at_time: string;
    item: TransactionItemDetail;
    discount_percentage_at_time?: number;
}
interface Transaction {
    id: number;
    total: number | string;
    status: string;
    note?: string;
    payment_method: string;
    created_at: string;
    details: TransactionDetail[];
    shipping_cost?: number;
}

interface OrderConfirmationPageProps {
    transactionId: number | string;
    transaction?: Transaction; // Seharusnya selalu ada dari controller sekarang
    totalAmount?: number;
}

interface SharedPageProps extends OrderConfirmationPageProps {
    flash: {
        success?: string;
        error?: string;
        info?: string;
        // snap_token tidak lagi diharapkan di sini setelah alur baru
    };
    midtrans_client_key: string;
    transaction: Transaction; // Pastikan transaksi dikirim dari controller
}

// Helper script loader (jika diperlukan untuk tombol "Bayar Lagi" nantinya)
const loadMidtransSnapScript = (clientKey: string, onLoaded: () => void, onError: () => void) => {
    const scriptId = 'midtrans-snap-script';
    if (document.getElementById(scriptId) && window.snap) {
        onLoaded(); return;
    }
    if (document.getElementById(scriptId) && !window.snap) {
        const existingScript = document.getElementById(scriptId);
        const handleLoad = () => window.snap ? onLoaded() : onError();
        existingScript?.addEventListener('load', handleLoad);
        existingScript?.addEventListener('error', onError);
        if (window.snap) onLoaded();
        return;
    }
    const script = document.createElement('script');
    script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL || "https://app.sandbox.midtrans.com/snap/snap.js";
    script.id = scriptId;
    script.setAttribute('data-client-key', clientKey);
    document.body.appendChild(script);
    script.onload = () => window.snap ? onLoaded() : onError();
    script.onerror = onError;
};
declare global { interface Window { snap: any; } }


export default function OrderConfirmation(props: OrderConfirmationPageProps) {
    const { props: pageProps } = usePage<SharedPageProps>();

    const { transaction: initialTransaction, transactionId: initialTransactionId } = props;
    const { flash: sharedFlash, midtrans_client_key: sharedMidtransKey, transaction: sharedTransaction } = pageProps;

    const currentTransaction = initialTransaction || sharedTransaction;
    const currentTransactionId = currentTransaction?.id || initialTransactionId;
    
    // midtransClientKey masih diperlukan jika ada tombol "Bayar Lagi"
    const midtransClientKey = sharedMidtransKey || (import.meta.env.VITE_MIDTRANS_CLIENT_KEY as string);


    const [currentFlashMessages, setCurrentFlashMessages] = useState<{success?: string, error?: string, info?: string} | undefined>(
        { success: sharedFlash?.success, error: sharedFlash?.error, info: sharedFlash?.info }
    );
    const [paymentStatusMessage, setPaymentStatusMessage] = useState<string | null>(null); // Pesan status lokal
    const [isRetryingPayment, setIsRetryingPayment] = useState(false);


    useEffect(() => {
        setCurrentFlashMessages({ success: sharedFlash?.success, error: sharedFlash?.error, info: sharedFlash?.info });
        if (sharedFlash?.success || sharedFlash?.error || sharedFlash?.info) {
            const timer = setTimeout(() => {
                setCurrentFlashMessages(undefined);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [sharedFlash]);

    // HAPUS useEffect yang memanggil snap.pay() secara otomatis
    // useEffect(() => {
    //     // Logika snap.pay otomatis sebelumnya ada di sini
    // }, [snapTokenFromFlash, midtransClientKey, currentTransaction?.status, currentTransaction?.id]);


    const handleRetryPayment = async () => {
        if (!currentTransaction || currentTransaction.status !== 'pending') {
            setPaymentStatusMessage('Pembayaran tidak dapat diulang untuk status pesanan ini.');
            return;
        }
        setIsRetryingPayment(true);
        setPaymentStatusMessage('Mencoba mengambil token pembayaran baru...');

        try {
            // Asumsi Anda akan membuat endpoint ini:
            const response = await router.post(route('client.payment.retry', currentTransaction.id), {}, {
                preserveScroll: true, // Untuk menjaga posisi scroll
                onSuccess: (page) => {
                    const newSnapToken = (page.props.flash as any)?.snap_token_retry; // Ambil token baru dari flash
                    if (newSnapToken && midtransClientKey) {
                        setPaymentStatusMessage('Token diterima, membuka jendela pembayaran Midtrans...');
                        loadMidtransSnapScript(midtransClientKey,
                            () => { // onLoaded
                                if (window.snap) {
                                    window.snap.pay(newSnapToken, {
                                        onSuccess: (result: any) => {
                                            setPaymentStatusMessage('Pembayaran berhasil! Memuat ulang...');
                                            router.reload({ only: ['transaction', 'flash'] });
                                        },
                                        onPending: (result: any) => {
                                            setPaymentStatusMessage(`Pembayaran tertunda (Status: ${result.status_message}). Memuat ulang...`);
                                            router.reload({ only: ['transaction', 'flash'] });
                                        },
                                        onError: (result: any) => {
                                            setPaymentStatusMessage(`Gagal memproses pembayaran ulang: ${result.status_message || 'Error tidak diketahui'}.`);
                                        },
                                        onClose: () => {
                                            setPaymentStatusMessage('Anda menutup popup pembayaran.');
                                            // Tidak reload otomatis, biarkan pengguna melihat status terakhir
                                        }
                                    });
                                } else {
                                     setPaymentStatusMessage('Gagal menginisialisasi Midtrans Snap untuk coba lagi.');
                                }
                            },
                            () => { // onError loading script
                                 setPaymentStatusMessage('Gagal memuat skrip Midtrans untuk coba lagi.');
                            }
                        );
                    } else {
                        setPaymentStatusMessage('Gagal mendapatkan token pembayaran baru dari server.');
                    }
                },
                onError: (errors) => {
                    setPaymentStatusMessage(`Gagal mencoba ulang pembayaran: ${Object.values(errors).join(', ')}`);
                },
                onFinish: () => {
                    setIsRetryingPayment(false);
                }
            });
        } catch (error) {
            console.error("Error retrying payment:", error);
            setPaymentStatusMessage('Terjadi kesalahan teknis saat mencoba ulang pembayaran.');
            setIsRetryingPayment(false);
        }
    };


    const formatCurrency = (amount: number | string | undefined): string => {
        if (amount === undefined || amount === null) return 'Rp -';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(numAmount).replace(/\s*IDR\s*/, 'Rp');
    };

    const getStatusClass = (status: string | undefined) => {
        switch (status) {
            case 'paid': case 'settlement': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'failed': case 'canceled': case 'expired': case 'deny': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (!currentTransaction) {
        return (
            <AppTemplate>
                <Head title="Memuat Pesanan..." />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p>Memuat detail pesanan...</p>
                     <Loader2 className="w-8 h-8 mx-auto mt-4 animate-spin text-green-600" />
                </div>
            </AppTemplate>
        );
    }

    return (
        <AppTemplate>
            <Head title={`Rincian Pesanan #${currentTransactionId}`} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 max-w-2xl mx-auto">
                    {currentFlashMessages?.success && (<div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center"><CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" /><span>{currentFlashMessages.success}</span></div>)}
                    {currentFlashMessages?.error && (<div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center"><AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" /><span>{currentFlashMessages.error}</span></div>)}
                    {currentFlashMessages?.info && (<div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md flex items-center"><Info className="w-6 h-6 mr-3 flex-shrink-0" /><span>{currentFlashMessages.info}</span></div>)}
                    
                    {paymentStatusMessage && (<div className={`mb-6 p-4 rounded-md flex items-center ${currentFlashMessages?.error || paymentStatusMessage.toLowerCase().includes('gagal') ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-blue-100 border border-blue-400 text-blue-700'}`}><Info className="w-6 h-6 mr-3 flex-shrink-0" /><span>{paymentStatusMessage}</span></div>)}

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Rincian Pesanan Anda</h1>
                    <p className="text-gray-600 mb-6">Terima kasih telah melakukan pemesanan. Berikut detailnya:</p>

                    <div className="border border-gray-200 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Order ID: #{currentTransactionId}</h2>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(currentTransaction?.status)}`}>Status: {currentTransaction?.status ? currentTransaction.status.charAt(0).toUpperCase() + currentTransaction.status.slice(1) : 'Memuat...'}</span>
                        </div>
                        <div className="mb-2"><span className="text-gray-500">Metode Pembayaran: </span><span className="text-gray-800 font-medium capitalize">{currentTransaction.payment_method ? currentTransaction.payment_method.replace(/_/g, ' ') : 'Belum Dipilih'}</span></div>
                        <div className="mb-4"><span className="text-gray-500">Tanggal Pesanan: </span><span className="text-gray-800 font-medium">{new Date(currentTransaction.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>

                        <h3 className="text-md font-semibold text-gray-700 mb-2 mt-4 border-t pt-4">Item Pesanan:</h3>
                        <ul className="space-y-2">
                            {currentTransaction.details.map(detail => {
                                const itemSubtotal = parseFloat(detail.price_at_time) * detail.quantity;
                                return (
                                    <li key={detail.id} className="flex justify-between items-center text-sm">
                                        <span>{detail.item.name} (x{detail.quantity})</span>
                                        <span>{formatCurrency(itemSubtotal)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                         {currentTransaction.shipping_cost && currentTransaction.shipping_cost > 0 && (
                             <div className="flex justify-between items-center text-sm mt-2">
                                 <span>Ongkos Kirim</span>
                                 <span>{formatCurrency(currentTransaction.shipping_cost)}</span>
                             </div>
                         )}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                                <span>Total Pesanan:</span><span>{formatCurrency(currentTransaction?.total)}</span>
                            </div>
                        </div>
                        {currentTransaction?.note && (<div className="mt-4 pt-4 border-t border-gray-200"><h3 className="text-md font-semibold text-gray-700 mb-1">Catatan Pesanan:</h3><p className="text-sm text-gray-600 whitespace-pre-line">{currentTransaction.note}</p></div>)}
                    </div>
                    
                    {currentTransaction?.status === 'pending' && !currentFlashMessages?.success && !currentFlashMessages?.info && !paymentStatusMessage && (
                        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-center">
                            Pesanan menunggu pembayaran. Jika Anda sudah menutup jendela pembayaran sebelumnya, Anda dapat mencoba membayar lagi.
                        </div>
                    )}

                     {currentTransaction?.status === 'pending' && (
                        <div className="mt-6 mb-6 text-center">
                            <button
                                onClick={handleRetryPayment}
                                disabled={isRetryingPayment}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto mx-auto disabled:opacity-50"
                            >
                                {isRetryingPayment ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <CreditCard className="w-5 h-5 mr-2" />
                                )}
                                {isRetryingPayment ? 'Memproses...' : 'Coba Bayar Lagi'}
                            </button>
                        </div>
                    )}


                    <div className="mt-8 text-center">
                        <Link href={route('Homepage')} className="text-green-600 hover:text-green-700 font-medium">&larr; Kembali ke Beranda</Link>
                    </div>
                </div>
            </div>
        </AppTemplate>
    );
}