import React, { useEffect, useState } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AppTemplate from '@/components/templates/app-template';
import { Loader2, AlertTriangle } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core'; // Import base Inertia PageProps

// Helper untuk memuat skrip Midtrans Snap (keep as is)
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
declare function route(name: string, params?: any): string;

// Props specific to this page, passed from the controller
interface PaymentInitiatePageSpecificProps {
    transactionId: number | string;
    totalAmount: number | string;
    orderStatus: string;
}

// Shared props that Inertia will provide, including flash, client_key, and base InertiaPageProps
interface SharedPropsForPaymentPage extends InertiaPageProps { // Extends InertiaPageProps
    flash: {
        success_payment_initiation?: string;
        snap_token?: string | null;
        error?: string;
    };
    midtrans_client_key: string;
    // errors: Errors & ErrorBag; // If you share errors globally and need them here
    // auth: any; // Example for other shared props
}

// The final props type for this page component
type PaymentInitiatePageCombinedProps = PaymentInitiatePageSpecificProps & SharedPropsForPaymentPage;


export default function PaymentInitiatePage(props: PaymentInitiatePageSpecificProps) { // Component receives specific props
    const { transactionId, totalAmount, orderStatus } = props;
    // Use the combined type for usePage
    const { props: pageSharedProps } = usePage<PaymentInitiatePageCombinedProps>();

    // Access shared props from pageSharedProps
    const snapToken = pageSharedProps.flash?.snap_token;
    const midtransClientKey = pageSharedProps.midtrans_client_key; // No need for fallback, should be in shared props
    const initialStatusMessageFromFlash = pageSharedProps.flash?.success_payment_initiation;
    const errorFromFlash = pageSharedProps.flash?.error;


    const [statusMessage, setStatusMessage] = useState<string>(initialStatusMessageFromFlash || 'Mempersiapkan pembayaran Anda...');
    const [errorMessage, setErrorMessage] = useState<string | null>(errorFromFlash || null);
    const [isMidtransPopupOpen, setIsMidtransPopupOpen] = useState(false);


    useEffect(() => {
        if (!snapToken) {
            setErrorMessage('Token pembayaran tidak ditemukan. Tidak dapat melanjutkan.');
            setStatusMessage('Gagal memuat pembayaran.');
            return;
        }
        if (!midtransClientKey) {
            setErrorMessage('Kunci klien Midtrans tidak dikonfigurasi. Tidak dapat melanjutkan.');
            setStatusMessage('Gagal memuat pembayaran.');
            return;
        }
        if (orderStatus !== 'pending') {
            setErrorMessage(`Status pesanan adalah "${orderStatus}", pembayaran tidak dapat dilanjutkan.`);
            setStatusMessage('Pembayaran tidak dapat diproses.');
            const timer = setTimeout(() => {
                 router.visit(route('client.orders.show', transactionId));
            }, 3000);
            return () => clearTimeout(timer);
        }

        loadMidtransSnapScript(midtransClientKey,
            () => { // onLoaded
                if (window.snap && snapToken && !isMidtransPopupOpen) {
                    setIsMidtransPopupOpen(true);
                    setStatusMessage('Mengalihkan ke halaman pembayaran Midtrans...');
                    window.snap.pay(snapToken, {
                        onSuccess: (result: any) => {
                            setIsMidtransPopupOpen(false);
                            console.log('Midtrans Payment Success (PaymentInitiatePage):', result);
                            setStatusMessage('Pembayaran berhasil! Mengalihkan...');
                        },
                        onPending: (result: any) => {
                            setIsMidtransPopupOpen(false);
                            console.log('Midtrans Payment Pending (PaymentInitiatePage):', result);
                            setStatusMessage('Pembayaran Anda tertunda. Mengalihkan...');
                        },
                        onError: (result: any) => {
                            setIsMidtransPopupOpen(false);
                            console.error('Midtrans Payment Error (PaymentInitiatePage):', result);
                            setErrorMessage('Terjadi kesalahan saat proses pembayaran dengan Midtrans. Silakan coba lagi dari halaman detail pesanan.');
                            setStatusMessage('Gagal memproses pembayaran.');
                             router.visit(route('client.orders.show', transactionId));
                        },
                        onClose: () => {
                            setIsMidtransPopupOpen(false);
                            console.log('Midtrans payment popup closed by user (PaymentInitiatePage)');
                            setStatusMessage('Anda menutup jendela pembayaran. Mengalihkan ke rincian pesanan...');
                            router.visit(route('client.orders.show', transactionId), {
                                preserveState: false,
                                preserveScroll: false,
                            });
                        }
                    });
                } else if (!snapToken && !isMidtransPopupOpen){
                     setErrorMessage('Token pembayaran tidak valid atau sudah digunakan.');
                     setStatusMessage('Gagal memulai pembayaran.');
                } else if (!window.snap && !isMidtransPopupOpen) {
                    setErrorMessage('Gagal menginisialisasi Midtrans Snap.');
                    setStatusMessage('Gagal memuat pembayaran.');
                }
            },
            () => { // onError loading script
                setErrorMessage('Tidak dapat memuat skrip pembayaran Midtrans. Periksa koneksi internet Anda.');
                setStatusMessage('Gagal memuat pembayaran.');
            }
        );
    }, [snapToken, midtransClientKey, transactionId, orderStatus]); // Removed isMidtransPopupOpen from deps

    const formatCurrency = (amount: number | string): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(numAmount).replace(/\s*IDR\s*/, 'Rp');
    };

    return (
        <AppTemplate>
            <Head title="Inisiasi Pembayaran" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 max-w-lg mx-auto text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Proses Pembayaran</h1>
                    <p className="text-gray-600 mb-2">Order ID: #{transactionId}</p>
                    <p className="text-gray-600 mb-6">Total: <span className="font-semibold">{formatCurrency(totalAmount)}</span></p>

                    {errorMessage ? (
                        <div className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    ) : (
                        <div className="my-6 p-4 bg-blue-50 border border-blue-300 text-blue-700 rounded-md flex items-center justify-center">
                            <Loader2 className="w-6 h-6 mr-3 flex-shrink-0 animate-spin" />
                            <span>{statusMessage}</span>
                        </div>
                    )}
                    
                    <p className="text-sm text-gray-500 mt-4">
                        Anda akan diarahkan ke Midtrans untuk menyelesaikan pembayaran.
                        Jika jendela pembayaran tidak muncul, pastikan pop-up diizinkan.
                    </p>
                     <div className="mt-8">
                        <Link 
                            href={route('client.orders.show', transactionId)} 
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Lihat Detail Pesanan / Coba Bayar Manual
                        </Link>
                         <span className="mx-2 text-gray-400">|</span>
                        <Link 
                            href={route('pesanan-saya')} 
                            className="text-sm text-green-600 hover:text-green-700 underline"
                        >
                            ke pesanan saya
                        </Link>
                    </div>
                </div>
            </div>
        </AppTemplate>
    );
}