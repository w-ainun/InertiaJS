import React, { useEffect } from 'react';

interface BackendItem {
    id: number;
    name: string;
    unit?: string;
}

interface BackendTransactionDetail {
    id: number;
    item: BackendItem;
    quantity: number;
    price_at_time: string; // Price per unit at time of purchase (before discount)
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

// Interface untuk Voucher yang digunakan dalam transaksi
interface BackendVoucher {
    id: number;
    code: string;
    description: string;
    // Tambahkan properti lain dari voucher jika ingin ditampilkan
}

interface ClientInfo {
    id: number;
    name: string; // Or username
    email: string;
}

interface BackendTransaction {
    id: number;
    total: string;
    note?: string | null;
    payment_method: string;
    status: string;
    delivery_option: 'delivery' | 'pickup';
    shipping_cost: string;
    address?: BackendAddress | null; // Delivery address
    details: BackendTransactionDetail[];
    created_at: string;
    updated_at: string;
    shipping_number?: string | null;
    pickup_deadline?: string | null;
    voucher_id: number | null;
    voucher_discount_amount: string; // Ini adalah string karena dari DB decimal
    voucher?: BackendVoucher | null; // Detail voucher jika diload
}

interface StoreContact {
    name: string;
    address: string;
    phone: string;
    email: string;
}

interface OrderReceiptProps {
    transaction: BackendTransaction;
    order_number_display: string;
    storeContact: StoreContact;
    client: ClientInfo;
    deliveryAddress?: BackendAddress | null;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({ transaction, order_number_display, storeContact, client, deliveryAddress }) => {

    useEffect(() => {
        // Optional: auto-trigger print dialog
        // window.print();
    }, []);

    const formatCurrency = (amount: number | string): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(numAmount).replace(/\s*IDR\s*/, 'Rp ');
    };

    const formatDate = (dateString?: string | null): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        }).replace(/\s+pukul\s+/, ' pukul ');
    };

    const calculateItemTotal = (detail: BackendTransactionDetail): number => {
        const price = parseFloat(detail.price_at_time);
        const discount = detail.discount_percentage_at_time || 0;
        const priceAfterDiscount = price * (1 - discount / 100);
        return priceAfterDiscount * detail.quantity;
    };

    const subtotalPreShipping = transaction.details.reduce((sum, detail) => sum + calculateItemTotal(detail), 0);

    const storeName = "RB Store";

    const getCourierText = (deliveryOption: 'delivery' | 'pickup', shippingNumber?: string | null): string => {
        if (deliveryOption === 'pickup') {
            return 'Diambil Pelanggan';
        }
        return shippingNumber || 'Pengiriman Reguler';
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-white text-gray-800 font-sans border border-gray-200 rounded-lg shadow-sm">
                <style>{`
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .no-print { display: none; }
                        .page-break { page-break-after: always; }
                        @page { margin: 0.5in; }
                    }
                    .dashed-line {
                        border-top: 1px dashed #9ca3af; /* gray-400 */
                        margin: 12px 0;
                    }
                    .thin-solid-line {
                        border-top: 1px solid #e2e8f0; /* gray-200 */
                        margin: 12px 0;
                    }
                    .thick-solid-line {
                        border-top: 2px solid #cbd5e0; /* gray-300 */
                        margin: 20px 0;
                    }
                `}</style>

                {/* Header - seperti sebelumnya, hanya info toko */}
                <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{storeName}</h1>
                    <p className="text-sm text-gray-600">perumahan raya telang indah timur gang 2, no a57</p>
                    <p className="text-sm text-gray-600">Telp: {storeContact.phone} | Email: {storeContact.email}</p>
                </div>

                {/* Bagian No. Pesanan di paling atas, sesuai screenshot */}
                <div className="mb-4 text-base">
                    <p><span className="text-gray-700">No. Pesanan</span></p>
                    <p className="font-bold text-gray-900 text-xl mt-1">{order_number_display}</p>
                </div>

                {/* Garis pemisah seperti di screenshot */}
                <div className="thin-solid-line my-4"></div>

                {/* Detail Layanan, Kurir, Tanggal Pesan, Metode Pembayaran */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6 text-sm">
                    {/* Kolom Kiri */}
                    <div>
                        <p className="text-gray-700">Layanan:</p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                            {transaction.delivery_option === 'delivery' ? 'Pengiriman ke Alamat' : 'Pickup ke Toko'}
                        </p>
                    </div>
                    {/* Kolom Kanan */}
                    <div>
                        <p className="text-gray-700">Kurir:</p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                            {getCourierText(transaction.delivery_option, transaction.shipping_number)}
                        </p>
                    </div>

                    {/* Kolom Kiri Bawah */}
                    <div>
                        <p className="text-gray-700">Tanggal Pesan:</p>
                        <p className="font-semibold text-gray-900 mt-0.5">{formatDate(transaction.created_at)}</p>
                    </div>
                    {/* Kolom Kanan Bawah */}
                    <div>
                        <p className="text-gray-700">Metode Pembayaran:</p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                            {transaction.payment_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                    </div>
                </div>

                {/* Garis tipis solid */}
                <div className="thin-solid-line mb-6"></div>

                {/* Detail Alamat Pengiriman (jika ada) */}
                {transaction.delivery_option === 'delivery' && deliveryAddress && (
                    <div className="mb-6 text-sm">
                        <h3 className="font-bold text-gray-700 mb-2">Alamat Pengiriman:</h3>
                        <address className="not-italic mt-1 text-gray-700">
                            {deliveryAddress.street}{deliveryAddress.more ? `, ${deliveryAddress.more}` : ''}<br />
                            {deliveryAddress.city}, {deliveryAddress.province} {deliveryAddress.post_code}<br />
                            {deliveryAddress.country}
                        </address>
                        {transaction.shipping_number && (
                            <p className="mt-2">No. Pengiriman: <span className="font-medium ml-1">{transaction.shipping_number}</span></p>
                        )}
                    </div>
                )}
                {/* Detail Batas Waktu Pengambilan (jika pickup) */}
                {transaction.delivery_option === 'pickup' && transaction.pickup_deadline && (
                    <div className="mb-6 text-sm">
                        <h3 className="font-bold text-gray-700 mb-2">Detail Pengambilan:</h3>
                        <p className="mt-2">Ambil Sebelum: <span className="font-medium ml-1">{formatDate(transaction.pickup_deadline)}</span></p>
                        <p className="text-gray-700 mt-1">Lokasi Pengambilan: {storeContact.address}</p>
                    </div>
                )}

                {/* Garis tipis solid (jika ada detail pengiriman/pengambilan yang ditampilkan) */}
                {(transaction.delivery_option === 'delivery' && deliveryAddress) || (transaction.delivery_option === 'pickup' && transaction.pickup_deadline) ? (
                    <div className="thin-solid-line mb-6"></div>
                ) : null}

                {/* Items Table */}
                <div className="mb-6">
                    <table className="w-full text-sm">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="text-left py-2 font-bold text-gray-700">Item</th>
                                <th className="text-center py-2 font-bold text-gray-700 w-16">Qty</th>
                                <th className="text-right py-2 font-bold text-gray-700 w-32">Harga Satuan</th>
                                <th className="text-right py-2 font-bold text-gray-700 w-32">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.details.map((detail) => {
                                const price = parseFloat(detail.price_at_time);
                                const discount = detail.discount_percentage_at_time || 0;
                                const priceAfterDiscount = price * (1 - discount / 100);
                                return (
                                    <tr key={detail.id} className="border-b border-gray-100 last:border-b-0">
                                        <td className="py-2 pr-1">
                                            <span className="font-medium text-gray-800">{detail.item.name}</span>
                                            {discount > 0 && <span className="text-red-500 text-xs block font-semibold">Diskon {discount}%</span>}
                                        </td>
                                        <td className="text-center py-2 text-gray-700">{detail.quantity}</td>
                                        <td className="text-right py-2 text-gray-700">{formatCurrency(priceAfterDiscount)}</td>
                                        <td className="text-right py-2 font-semibold text-gray-900">{formatCurrency(priceAfterDiscount * detail.quantity)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="w-full text-sm">
                    <div className="flex justify-end mb-2 items-center">
                        <span className="w-2/5 text-right text-gray-700 pr-2">Subtotal Item:</span>
                        <span className="w-2/5 text-right font-semibold text-gray-900">{formatCurrency(subtotalPreShipping)}</span>
                    </div>
                    {parseFloat(transaction.shipping_cost) > 0 && (
                        <div className="flex justify-end mb-2 items-center">
                            <span className="w-2/5 text-right text-gray-700 pr-2">Ongkos Kirim:</span>
                            <span className="w-2/5 text-right font-semibold text-gray-900">{formatCurrency(transaction.shipping_cost)}</span>
                        </div>
                    )}
                    {/* DITAMBAH: Potongan Voucher */}
                    {transaction.voucher_id && parseFloat(transaction.voucher_discount_amount) > 0 && ( // Pastikan voucher_id ada dan diskon > 0
                        <div className="flex justify-end mb-2 items-center">
                            <span className="w-2/5 text-right text-gray-700 pr-2">
                                Potongan Voucher ({transaction.voucher?.code || 'Voucher'}):
                            </span>
                            <span className="w-2/5 text-right font-semibold text-red-600">
                                -{formatCurrency(transaction.voucher_discount_amount)}
                            </span>
                        </div>
                    )}
                    <div className="dashed-line my-4"></div>
                    <div className="flex justify-end mb-2 items-center">
                        <span className="w-2/5 text-right font-bold text-lg text-gray-800 pr-2">GRAND TOTAL:</span>
                        <span className="w-2/5 text-right font-bold text-lg text-green-700">{formatCurrency(transaction.total)}</span>
                    </div>
                </div>

                {transaction.note && (
                    <>
                        <div className="dashed-line my-4"></div>
                        <div className="mt-4 text-sm text-gray-700">
                            <h4 className="font-bold mb-2">Catatan Pesanan:</h4>
                            <p className="whitespace-pre-line bg-gray-50 p-3 rounded-md border border-gray-100">{transaction.note.replace(/Delivery to:.*?\n---\n|Pickup from store.\n---\n/g, '')}</p>
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="thick-solid-line my-6"></div>
                <div className="text-center text-sm mt-6 text-gray-600">
                    <p className="mb-1">Terima kasih telah berbelanja di <span className="font-semibold text-gray-800">{storeName}</span>!</p>
                    <p>Simpan struk ini sebagai bukti pembayaran Anda.</p>
                </div>

                {/* Print Button */}
                <div className="mt-8 text-center no-print">
                    <button
                        onClick={() => window.print()}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center mx-auto text-base"
                    >
                        Cetak Struk
                    </button>
                </div>
            </div>
        </>
    );
};

export default OrderReceipt;