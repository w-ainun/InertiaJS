// resources/js/Pages/Client/OrderReceipt.tsx
import React, { useEffect } from 'react';
// Removed: import { Head, usePage } from '@inertiajs/react'; // These imports caused the compilation error
import { Package, Printer, ShoppingBag } from 'lucide-react'; // Icons

// Mirror relevant interfaces from PesananSaya or define specifically for receipt
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
  // client: ClientInfo; // User who made the order - passed as 'client' prop
}

interface StoreContact {
    name: string;
    address: string;
    phone: string;
    email: string;
}

// Changed from OrderReceiptPageProps to OrderReceiptProps to reflect direct props
interface OrderReceiptProps {
  transaction: BackendTransaction;
  order_number_display: string;
  storeContact: StoreContact;
  client: ClientInfo;
  deliveryAddress?: BackendAddress | null;
}

// Modified component signature to receive props directly
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
      hour: '2-digit', minute: '2-digit'
    });
  };

  const calculateItemTotal = (detail: BackendTransactionDetail): number => {
    const price = parseFloat(detail.price_at_time);
    const discount = detail.discount_percentage_at_time || 0;
    const priceAfterDiscount = price * (1 - discount / 100);
    return priceAfterDiscount * detail.quantity;
  };
  
  const subtotalPreShipping = transaction.details.reduce((sum, detail) => sum + calculateItemTotal(detail), 0);

  // Hardcode store name as requested
  const storeName = "RB Store";

  return (
    <>
      {/* Removed: <Head title={`Struk Pesanan ${order_number_display}`} /> */}
      {/* Added border and shadow to the main container for neatness */}
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
          /* Added a solid thin line style for additional neatness */
          .thin-solid-line {
            border-top: 1px solid #e2e8f0; /* gray-200 */
            margin: 12px 0;
          }
        `}</style>

        {/* Header - now uses the hardcoded storeName and has a bottom border */}
        <div className="text-center mb-6 pb-4 border-b border-gray-200">
            <ShoppingBag className="w-16 h-16 mx-auto text-green-600 mb-2" />
            <h1 className="text-2xl font-semibold">{storeName}</h1> {/* Changed here */}
            <p className="text-xs">perumahan raya telang indah timur gang 2, no a57 </p>
            <p className="text-xs">Telp: 0857-0865-4651 | Email: RBstore@gmail.com</p>
        </div>

        {/* Order & Client Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div>
                <h3 className="font-semibold mb-1">Detail Pesanan:</h3>
                <p>No. Pesanan: <span className="font-medium">{order_number_display}</span></p>
                <p>Tanggal: <span className="font-medium">{formatDate(transaction.created_at)}</span></p>
                <p>Status: <span className="font-medium">{transaction.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
                <p>Pembayaran: <span className="font-medium">{transaction.payment_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
            </div>
            <div>
                <h3 className="font-semibold mb-1">Pelanggan:</h3>
                <p>{client.name}</p>
                <p>{client.email}</p>
                {/* Add phone if available and needed */}
            </div>
        </div>

        {/* Added a solid thin line to separate sections */}
        <div className="thin-solid-line"></div>

        <div className="mb-4 text-xs">
            <h3 className="font-semibold mb-1">Opsi Pengiriman/Pengambilan:</h3>
            <p>{transaction.delivery_option === 'delivery' ? 'Pengiriman ke Alamat' : 'Ambil Sendiri di Toko'}</p>
            {transaction.delivery_option === 'delivery' && deliveryAddress && (
                <address className="not-italic mt-1">
                    {deliveryAddress.street}{deliveryAddress.more ? `, ${deliveryAddress.more}` : ''}<br />
                    {deliveryAddress.city}, {deliveryAddress.province} {deliveryAddress.post_code}<br/>
                    {deliveryAddress.country}
                </address>
            )}
            {transaction.delivery_option === 'delivery' && transaction.shipping_number && (
                <p className="mt-1">No. Pengiriman: <span className="font-medium">{transaction.shipping_number}</span></p>
            )}
             {transaction.delivery_option === 'pickup' && transaction.pickup_deadline && (
                <p className="mt-1">Ambil Sebelum: <span className="font-medium">{formatDate(transaction.pickup_deadline)}</span></p>
            )}
        </div>

        {/* Added a solid thin line to separate sections */}
        <div className="thin-solid-line"></div>

        {/* Items Table */}
        <div className="mb-4">
            <table className="w-full text-xs">
                <thead className="border-b-2 border-gray-300">
                    <tr>
                        <th className="text-left py-1 font-semibold">Item</th>
                        <th className="text-center py-1 font-semibold">Qty</th>
                        <th className="text-right py-1 font-semibold">Harga Satuan</th>
                        <th className="text-right py-1 font-semibold">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {transaction.details.map((detail) => {
                           const price = parseFloat(detail.price_at_time);
                           const discount = detail.discount_percentage_at_time || 0;
                           const priceAfterDiscount = price * (1 - discount / 100);
                         return (
                            <tr key={detail.id} className="border-b border-gray-200">
                                <td className="py-1.5 pr-1">{detail.item.name}
                                  {discount > 0 && <span className="text-red-500 text-2xs block">Disc {discount}%</span>}
                                </td>
                                <td className="text-center py-1.5">{detail.quantity}</td>
                                <td className="text-right py-1.5">{formatCurrency(priceAfterDiscount)}</td>
                                <td className="text-right py-1.5">{formatCurrency(priceAfterDiscount * detail.quantity)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>

        {/* Totals */}
        <div className="w-full text-xs">
             <div className="flex justify-end mb-1">
                <span className="w-2/5 text-right">Subtotal Item:</span>
                <span className="w-2/5 text-right font-medium">{formatCurrency(subtotalPreShipping)}</span>
            </div>
            {parseFloat(transaction.shipping_cost) > 0 && (
                 <div className="flex justify-end mb-1">
                    <span className="w-2/5 text-right">Ongkos Kirim:</span>
                    <span className="w-2/5 text-right font-medium">{formatCurrency(transaction.shipping_cost)}</span>
                </div>
            )}
            <div className="dashed-line"></div>
             <div className="flex justify-end mb-2">
                <span className="w-2/5 text-right font-semibold text-sm">GRAND TOTAL:</span>
                <span className="w-2/5 text-right font-bold text-sm">{formatCurrency(transaction.total)}</span>
            </div>
        </div>
        
        {transaction.note && (
            <>
                <div className="dashed-line"></div>
                <div className="mt-4 text-xs">
                    <h4 className="font-semibold mb-1">Catatan Pesanan:</h4>
                    <p className="whitespace-pre-line">{transaction.note.replace(/Delivery to:.*?\n---\n|Pickup from store.\n---\n/g, '')}</p>
                </div>
            </>
        )}

        {/* Footer - now uses the hardcoded storeName */}
        <div className="dashed-line"></div>
        <div className="text-center text-xs mt-6">
            <p>Terima kasih telah berbelanja di {storeName}!</p> {/* Changed here */}
            <p>Simpan struk ini sebagai bukti pembayaran.</p>
        </div>

        {/* Print Button */}
        <div className="mt-8 text-center no-print">
          <button
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:shadow-md transition duration-150 flex items-center justify-center mx-auto"
          >
            <Printer size={18} className="mr-2" /> Cetak Struk
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderReceipt; // Export OrderReceipt as default
