// PaymentInitiatePage.tsx
import React, { useEffect, useState } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AppTemplate from '@/components/templates/app-template';
import { Loader2, AlertTriangle } from 'lucide-react';

// --- Helper untuk logging yang lebih konsisten ---
const logDebug = (message: string, data: any = '') => {
    console.log(`[PaymentInitiatePage DEBUG] ${message}`, data);
};

const loadMidtransSnapScript = (clientKey: string, onLoaded: () => void, onError: () => void) => {
    const scriptId = 'midtrans-snap-script';
    logDebug('Memulai proses loadMidtransSnapScript.');

    if (document.getElementById(scriptId) && window.snap) {
        logDebug('Script Midtrans sudah ada dan window.snap tersedia. Memanggil onLoaded.');
        onLoaded();
        return;
    }

    if (document.getElementById(scriptId) && !window.snap) {
        logDebug('Script tag sudah ada tapi window.snap belum siap. Menambahkan event listener.');
        const existingScript = document.getElementById(scriptId);
        const handleLoad = () => window.snap ? onLoaded() : onError();
        existingScript?.addEventListener('load', handleLoad);
        existingScript?.addEventListener('error', onError);
        if (window.snap) onLoaded(); // Cek ulang jika sudah termuat saat ini
        return;
    }

    logDebug('Membuat elemen script Midtrans baru.');
    const script = document.createElement('script');
    script.src = import.meta.env.VITE_MIDTRANS_SNAP_URL || "https://app.sandbox.midtrans.com/snap/snap.js";
    script.id = scriptId;
    script.setAttribute('data-client-key', clientKey);
    document.body.appendChild(script);

    script.onload = () => {
        if (window.snap) {
            logDebug('Script berhasil dimuat (onload) dan window.snap ditemukan.');
            onLoaded();
        } else {
            logDebug('Script berhasil dimuat (onload) TAPI window.snap TIDAK ditemukan.');
            onError();
        }
    };

    script.onerror = () => {
        logDebug('Gagal memuat script Midtrans (onerror).');
        onError();
    };
};

declare global { interface Window { snap: any; } }
declare function route(name: string, params?: any): string;

interface PaymentInitiatePageSpecificProps {
    transactionId: number | string;
    totalAmount: number | string;
    orderStatus: string;
}

interface SharedPropsForPaymentPage extends InertiaPageProps {
    flash: {
        success_payment_initiation?: string;
        snap_token?: string | null;
        error?: string;
    };
    midtrans_client_key: string;
}

type PaymentInitiatePageCombinedProps = PaymentInitiatePageSpecificProps & SharedPropsForPaymentPage;

export default function PaymentInitiatePage(props: PaymentInitiatePageSpecificProps) {
    logDebug('Component RENDER/RE-RENDER.');
    const { transactionId, totalAmount, orderStatus } = props;
    const { props: pageSharedProps } = usePage<PaymentInitiatePageCombinedProps>();
    const snapToken = pageSharedProps.flash?.snap_token;
    const midtransClientKey = pageSharedProps.midtrans_client_key;
    const initialStatusMessageFromFlash = pageSharedProps.flash?.success_payment_initiation;
    const errorFromFlash = pageSharedProps.flash?.error;

    logDebug('Props diterima:', props);
    logDebug('Shared props dari usePage:', pageSharedProps);
    logDebug('Ekstraksi variabel:', { snapToken, midtransClientKey, initialStatusMessageFromFlash, errorFromFlash });

    const [statusMessage, setStatusMessage] = useState<string>(initialStatusMessageFromFlash || 'Mempersiapkan pembayaran Anda...');
    const [errorMessage, setErrorMessage] = useState<string | null>(errorFromFlash || null);
    const [isMidtransPopupOpen, setIsMidtransPopupOpen] = useState(false);

    useEffect(() => {
        logDebug('--- useEffect triggered ---');
        logDebug('Dependencies:', { snapToken, midtransClientKey, transactionId, orderStatus });

        if (!snapToken) {
            logDebug('VALIDATION FAILED: Snap Token tidak ditemukan.');
            setErrorMessage('Token pembayaran tidak ditemukan. Tidak dapat melanjutkan.');
            setStatusMessage('Gagal memuat pembayaran.');
            return;
        }
        if (!midtransClientKey) {
            logDebug('VALIDATION FAILED: Kunci klien Midtrans tidak ditemukan.');
            setErrorMessage('Kunci klien Midtrans tidak dikonfigurasi. Tidak dapat melanjutkan.');
            setStatusMessage('Gagal memuat pembayaran.');
            return;
        }
        if (orderStatus !== 'pending') {
            logDebug(`VALIDATION FAILED: Status pesanan adalah "${orderStatus}", bukan "pending".`);
            setErrorMessage(`Status pesanan adalah "${orderStatus}", pembayaran tidak dapat dilanjutkan.`);
            setStatusMessage('Pembayaran tidak dapat diproses.');
            const timer = setTimeout(() => {
                 logDebug('Redirecting karena status pesanan tidak valid...');
                 router.visit(route('client.orders.show', transactionId));
            }, 3000);
            return () => clearTimeout(timer);
        }

        logDebug('Validasi awal berhasil. Memanggil loadMidtransSnapScript.');
        loadMidtransSnapScript(midtransClientKey,
            () => { // onLoaded callback
                logDebug('Callback onLoaded dari loadMidtransSnapScript dijalankan.');
                if (window.snap && snapToken && !isMidtransPopupOpen) {
                    setIsMidtransPopupOpen(true);
                    logDebug('Siap memanggil window.snap.pay dengan token:', snapToken);
                    setStatusMessage('Mengalihkan ke halaman pembayaran Midtrans...');
                    window.snap.pay(snapToken, {
                        onSuccess: (result: any) => {
                            setIsMidtransPopupOpen(false);
                            logDebug('Midtrans Callback: onSuccess', result);
                            setStatusMessage('Pembayaran berhasil! Mengalihkan ke rincian pesanan...');
                            logDebug('Redirecting (onSuccess) ke client.orders.show');
                            router.visit(route('client.orders.show', transactionId), {
                                preserveState: false,
                                preserveScroll: false,
                            });
                        },
                        onPending: (result: any) => {
                            setIsMidtransPopupOpen(false);
                            logDebug('Midtrans Callback: onPending', result);
                            setStatusMessage('Pembayaran Anda sedang diproses. Mengalihkan ke rincian pesanan...');
                             logDebug('Redirecting (onPending) ke client.orders.show');
                            router.visit(route('client.orders.show', transactionId), {
                                preserveState: false,
                                preserveScroll: false,
                            });
                        },
                        onError: (result: any) => {
                            setIsMidtransPopupOpen(false);
                            console.error('[PaymentInitiatePage ERROR] Midtrans Callback: onError', result);
                            setErrorMessage('Terjadi kesalahan saat proses pembayaran dengan Midtrans. Silakan coba lagi.');
                            setStatusMessage('Gagal memproses pembayaran.');
                            logDebug('Redirecting (onError) ke client.orders.show');
                            router.visit(route('client.orders.show', transactionId));
                        },
                        onClose: () => {
                            setIsMidtransPopupOpen(false);
                            logDebug('Midtrans Callback: onClose (popup ditutup oleh user)');
                            setStatusMessage('Anda menutup jendela pembayaran. Mengalihkan ke rincian pesanan...');
                            logDebug('Redirecting (onClose) ke client.orders.show');
                            router.visit(route('client.orders.show', transactionId), {
                                preserveState: false,
                                preserveScroll: false,
                            });
                        }
                    });
                } else {
                     logDebug('Kondisi untuk membuka snap.pay tidak terpenuhi.', { hasSnap: !!window.snap, hasSnapToken: !!snapToken, isPopupOpen: isMidtransPopupOpen });
                     if (!snapToken && !isMidtransPopupOpen){
                         setErrorMessage('Token pembayaran tidak valid atau sudah digunakan.');
                         setStatusMessage('Gagal memulai pembayaran.');
                     } else if (!window.snap && !isMidtransPopupOpen) {
                        setErrorMessage('Gagal menginisialisasi Midtrans Snap.');
                        setStatusMessage('Gagal memuat pembayaran.');
                    }
                }
            },
            () => { // onError callback (script failed to load)
                logDebug('Callback onError dari loadMidtransSnapScript dijalankan.');
                setErrorMessage('Tidak dapat memuat skrip pembayaran Midtrans. Periksa koneksi internet Anda.');
                setStatusMessage('Gagal memuat pembayaran.');
            }
        );
    }, [snapToken, midtransClientKey, transactionId, orderStatus]);

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