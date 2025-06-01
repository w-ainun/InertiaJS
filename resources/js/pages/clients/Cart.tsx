import React, { useState, useEffect, FormEvent } from 'react';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import AppTemplate from '@/components/templates/app-template';
import { ShoppingCart, MapPin, Truck, Building, ArrowRight, PlusCircle, Home, X, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { Errors, ErrorBag } from '@inertiajs/core';

declare function route(name: string, params?: any): string;

export interface AddressProps {
  id?: number;
  post_code: string;
  country: string;
  province: string;
  city: string;
  street: string;
  more: string;
  summary?: string;
  [key: string]: string | number | undefined;
}

interface UserInfo {
    name: string;
    contact_phone: string | null;
    email?: string;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    discount: number;
    total: number;
    discounted_total: number;
}

interface CheckoutFormData {
    note: string;
    delivery_option: 'delivery' | 'pickup';
    selected_address_id: number | null;
    [key: string]: string | number | boolean | File | null | 'delivery' | 'pickup'; // Keep this as is for useForm
}

interface CartPageProps {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    addresses: AddressProps[];
    user: UserInfo;
    errors: Errors & ErrorBag;
    flash: {
        success?: string;
        error?: string;
        info?: string;
        snap_token?: string | null;
    };
}

export default function Cart(props: CartPageProps) {
    const {
        items,
        subtotal,
        discount,
        shipping,
        total,
        addresses: initialAddresses,
        user,
        errors: serverErrors,
        flash
    } = props;

    const { data, setData, post, processing, errors: formErrors, reset } = useForm<CheckoutFormData>({
        note: '',
        delivery_option: 'delivery',
        selected_address_id: initialAddresses.length > 0 ? initialAddresses[0].id ?? null : null,
    });

    const [currentShippingCost, setCurrentShippingCost] = useState(shipping);
    const [currentAddresses, setCurrentAddresses] = useState<AddressProps[]>(initialAddresses);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState<Omit<AddressProps, 'id' | 'summary'>>({
        street: '', city: '', province: '', post_code: '', country: 'Indonesia', more: ''
    });
    const [addAddressError, setAddAddressError] = useState<string | null>(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [pageMessage, setPageMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);

    useEffect(() => {
        if (flash?.success) setPageMessage({ type: 'success', text: flash.success });
        if (flash?.error) setPageMessage({ type: 'error', text: flash.error });
        if (flash?.success || flash?.error || flash?.info) {
            const timer = setTimeout(() => {
                setPageMessage(null);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        setCurrentAddresses(initialAddresses);
        if (initialAddresses.length > 0 && (data.selected_address_id === null || !initialAddresses.find(addr => addr.id === data.selected_address_id))) {
             setData('selected_address_id', initialAddresses[0].id ?? null);
        } else if (initialAddresses.length === 0) {
            setData('selected_address_id', null);
        }
    }, [initialAddresses]);

    useEffect(() => {
        if (data.delivery_option === 'pickup') {
            setCurrentShippingCost(0);
            setData('selected_address_id', null);
        } else {
            setCurrentShippingCost(shipping);
            if (currentAddresses.length > 0 && !data.selected_address_id) {
                 setData('selected_address_id', currentAddresses[0].id ?? null);
            }
        }
    }, [data.delivery_option, shipping, currentAddresses]);

    const finalTotal = subtotal - discount + currentShippingCost;

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 0) return;
        router.patch(route('client.cart.update'), {
            item_id: itemId,
            quantity: newQuantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                 window.dispatchEvent(new Event('cart-updated'));
                 setPageMessage({type: 'success', text: 'Kuantitas item diperbarui.'});
            },
            onError: (errorPayload) => {
                const errorMessages = Object.values(errorPayload).join("\n");
                setPageMessage({type: 'error', text: `Gagal memperbarui kuantitas: ${errorMessages}`});
            }
        });
    };

    const removeItem = (itemId: number) => {
        if (confirm('Anda yakin ingin menghapus item ini dari keranjang?')) {
            router.delete(route('client.cart.remove'), {
                data: { item_id: itemId },
                preserveScroll: true,
                onSuccess: () => {
                    window.dispatchEvent(new Event('cart-updated'));
                    setPageMessage({type: 'success', text: 'Item berhasil dihapus dari keranjang.'});
                },
                onError: (errorPayload) => {
                    const errorMessages = Object.values(errorPayload).join("\n");
                    setPageMessage({type: 'error', text: `Gagal menghapus item: ${errorMessages}`});
                }
            });
        }
    };

   const handleCheckout = () => {
        if (data.delivery_option === 'delivery' && !data.selected_address_id && currentAddresses.length > 0) {
            setPageMessage({type: 'error', text: 'Silakan pilih alamat pengiriman.'});
            return;
        }
        if (data.delivery_option === 'delivery' && currentAddresses.length === 0) {
            setPageMessage({type: 'error', text: 'Silakan tambahkan alamat pengiriman terlebih dahulu.'});
            return;
        }
        post(route('client.cart.checkout'), {
            onSuccess: () => {
                window.dispatchEvent(new Event('cart-updated'));
            },
            onError: (errorPayload) => {
                console.error('Checkout error:', errorPayload);
                const errorMessages = Object.values(errorPayload).join("\n");
                setPageMessage({type: 'error', text: `Gagal checkout: ${errorMessages}. Mohon periksa kembali.`});
            }
        });
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(amount).replace(/\s*IDR\s*/, 'Rp');
    };

    const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAttemptOpenAddAddressModal = () => {
        if (!user.contact_phone) {
            setShowProfileCompletionModal(true);
        } else {
            setAddAddressError(null);
            setNewAddress({ street: '', city: '', province: '', post_code: '', country: 'Indonesia', more: '' });
            setShowAddAddressModal(true);
        }
    };

    const handleAddNewAddress = async (e: FormEvent) => {
        e.preventDefault();
        setIsAddingAddress(true);
        setAddAddressError(null);
        try {
            const response = await axios.post(route('profile.address.store'), newAddress);

            if (response.status === 201 && response.data.address) {
                const addedAddress = response.data.address as AddressProps;
                router.reload({
                    only: ['addresses'],
                    onSuccess: (page) => {
                        const reloadedPageProps = page.props as Partial<CartPageProps>;
                        if (reloadedPageProps.addresses) {
                             setCurrentAddresses(reloadedPageProps.addresses);
                        }
                        setData('selected_address_id', addedAddress.id ?? null);
                        setShowAddAddressModal(false);
                        setNewAddress({ street: '', city: '', province: '', post_code: '', country: 'Indonesia', more: '' });
                        setPageMessage({type: 'success', text: 'Alamat berhasil ditambahkan!'});
                    },
                    onError: (): void => { // Explicitly type return if function does not return anything
                        setAddAddressError('Gagal memuat ulang data alamat setelah penambahan.');
                    }
                });
            }
        } catch (error: any) {
            console.error('Failed to add address:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const messages = Object.values(error.response.data.errors).flat().join("\n");
                setAddAddressError(`Validasi Gagal: ${messages}`);
            } else if (error.response && error.response.data && error.response.data.message) {
                setAddAddressError(`Gagal: ${error.response.data.message}`);
            } else {
                setAddAddressError('Terjadi kesalahan saat menambahkan alamat. Coba lagi.');
            }
        } finally {
            setIsAddingAddress(false);
        }
    };

    // Type `allErrors` to accept `string | undefined` for its values.
    // `formErrors` is Partial<Record<keyof CheckoutFormData, string>>, so its values can be undefined.
    // `serverErrors` is Errors & ErrorBag; individual errors are strings, but a field might not have an error.
    const allErrors: Record<string, string | undefined> = { ...formErrors };

    if (serverErrors) {
        for (const key in serverErrors) {
            // Ensure the key is a direct property and not already set by formErrors
            if (Object.prototype.hasOwnProperty.call(serverErrors, key) && !allErrors[key]) {
                const errorValue = serverErrors[key];
                // ErrorBag might store errors as string[] or string. Take the first if array.
                allErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
            }
        }
    }
    // Now `allErrors.some_field` will correctly be typed as `string | undefined`.
    // When rendering, you'll need to handle the undefined case (e.g., `allErrors.note && <p>{allErrors.note}</p>`).
    // This is already typical for displaying optional error messages.

    return (
        <AppTemplate>
            <Head title="Keranjang Belanja" />
            <div className="min-h-screen bg-gray-100">
                <div className="bg-green-600 text-white py-6 shadow-md">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-8 h-8" />
                            <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {pageMessage && (
                        <div className={`mb-4 p-4 rounded-md text-white ${pageMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {pageMessage.text}
                             <button onClick={() => setPageMessage(null)} className="float-right font-bold">X</button>
                        </div>
                    )}
                    {items.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                             <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Keranjang Anda Kosong</h2>
                            <p className="text-gray-500 mb-6">Sepertinya Anda belum menambahkan item apapun ke keranjang.</p>
                            <Link
                                href={route('Homepage')}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150 ease-in-out"
                            >
                                Mulai Belanja
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <MapPin className="w-6 h-6 text-orange-500 mr-3" /> Alamat Pengiriman
                                        </h2>
                                        {data.delivery_option === 'delivery' && (
                                            <button
                                                onClick={handleAttemptOpenAddAddressModal}
                                                className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md flex items-center disabled:opacity-50"
                                                disabled={processing || isAddingAddress}
                                            > <PlusCircle className="w-4 h-4 mr-1" /> Tambah Alamat
                                            </button>
                                        )}
                                    </div>
                                    {data.delivery_option === 'delivery' ? (
                                        currentAddresses.length > 0 ? (
                                            <div className="space-y-3">
                                                {currentAddresses.map((address) => (
                                                    <label key={address.id} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${data.selected_address_id === address.id ? 'border-green-500 ring-2 ring-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                                        <input type="radio" name="selected_address_id" value={address.id} checked={data.selected_address_id === address.id} onChange={(e) => setData('selected_address_id', parseInt(e.target.value))} className="mt-1 mr-3 h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" disabled={data.delivery_option !== 'delivery' || processing} />
                                                        <div>
                                                            <span className="font-semibold text-gray-700">{user.name}</span>
                                                            {user.contact_phone && <span className="text-sm text-gray-500 ml-2">({user.contact_phone})</span>}
                                                            <p className="text-sm text-gray-600">{address.summary || `${address.street}, ${address.city}`}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                                {allErrors.selected_address_id && <p className="text-red-500 text-sm mt-1">{allErrors.selected_address_id}</p>}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                                <Home className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                                <p className="text-gray-600 mb-2">Anda belum memiliki alamat pengiriman.</p>
                                                <p className="text-sm text-gray-500">Silakan tambahkan alamat baru atau lengkapi profil jika diminta.</p>
                                            </div>
                                        )
                                    ) : (
                                         <p className="text-gray-500 text-sm">Pengambilan di toko dipilih. Alamat tidak diperlukan.</p>
                                    )}
                                </div>

                                <div className="bg-white rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200"> Item di Keranjang ({items.length}) </h2>
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                                        <p className="text-green-600 font-semibold text-sm">{formatCurrency(item.price)} / {item.unit}</p>
                                                        {item.discount > 0 && (<p className="text-xs text-red-500">Diskon {item.discount}%</p>)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50" disabled={item.quantity <= 0 || processing}>-</button>
                                                    <span className="w-10 text-center font-semibold text-gray-700">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50" disabled={processing}>+</button>
                                                    <button onClick={() => removeItem(item.id)} className="ml-3 text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50" disabled={processing}>Hapus</button>
                                                </div>
                                            </div>
                                            <p className="text-right text-gray-700 font-semibold mt-2 sm:mt-0">Subtotal Item: {formatCurrency(item.discounted_total)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-1 space-y-6">
                                 <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">Opsi Pengambilan</h3>
                                    <div className="space-y-3">
                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${data.delivery_option === 'delivery' ? 'border-green-500 ring-2 ring-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input type="radio" name="delivery_option" value="delivery" checked={data.delivery_option === 'delivery'} onChange={(e) => setData('delivery_option', e.target.value as 'delivery' | 'pickup')} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" disabled={processing}/>
                                            <Truck className="w-6 h-6 text-green-600" />
                                            <div><span className="font-medium text-gray-700">Delivery</span><p className="text-xs text-gray-500">Akan dikirim ke alamat Anda.</p></div>
                                        </label>
                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${data.delivery_option === 'pickup' ? 'border-green-500 ring-2 ring-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}>
                                            <input type="radio" name="delivery_option" value="pickup" checked={data.delivery_option === 'pickup'} onChange={(e) => setData('delivery_option', e.target.value as 'delivery' | 'pickup')} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" disabled={processing}/>
                                            <Building className="w-6 h-6 text-blue-600" />
                                            <div><span className="font-medium text-gray-700">Ambil di Toko</span><p className="text-xs text-gray-500">Siap diambil di lokasi toko.</p></div>
                                        </label>
                                    </div>
                                     {allErrors.delivery_option && <p className="text-red-500 text-sm mt-1">{allErrors.delivery_option}</p>}
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">Ringkasan Pesanan</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span className="text-gray-600">Subtotal Produk:</span><span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">Total Diskon Produk:</span><span className="font-semibold text-red-500">-{formatCurrency(discount)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">Ongkos Kirim:</span><span className="font-semibold text-gray-800">{formatCurrency(currentShippingCost)}</span></div>
                                        <hr className="my-3 border-gray-200" />
                                        <div className="flex justify-between text-lg"><span className="font-bold text-gray-800">Total Bayar</span><span className="font-bold text-green-600">{formatCurrency(finalTotal)}</span></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <label htmlFor="order_note" className="block text-sm font-medium text-gray-700 mb-2">Catatan Pesanan (Opsional)</label>
                                    <textarea id="order_note" value={data.note} onChange={(e) => setData('note', e.target.value)} placeholder="Tambahkan catatan untuk pesanan Anda..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" rows={3} disabled={processing}/>
                                    {allErrors.note && <p className="text-red-500 text-sm mt-1">{allErrors.note}</p>}
                                </div>
                                <button onClick={handleCheckout} disabled={processing || items.length === 0 || (data.delivery_option === 'delivery' && !data.selected_address_id && currentAddresses.length > 0) || (data.delivery_option === 'delivery' && currentAddresses.length === 0) } className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed">
                                    {processing ? (<><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>Memproses...</>) : (<>Lanjut ke Pembayaran <ArrowRight className="w-5 h-5" /></>)}
                                </button>
                                {data.delivery_option === 'delivery' && !data.selected_address_id && currentAddresses.length > 0 && (<p className="text-red-500 text-sm mt-2 text-center">Silakan pilih alamat pengiriman.</p>)}
                                {data.delivery_option === 'delivery' && currentAddresses.length === 0 && (<p className="text-red-500 text-sm mt-2 text-center">Tidak ada alamat. Silakan tambahkan alamat pengiriman setelah melengkapi profil jika diminta.</p>)}
                                {allErrors.checkout_error && <p className="text-red-500 text-sm mt-2 text-center">{allErrors.checkout_error}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showProfileCompletionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                        <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-3">Profil Belum Lengkap</h3>
                        <p className="text-gray-600 mb-6">
                            Untuk menambahkan alamat baru, mohon lengkapi **Nama Kontak** dan **Nomor Telepon** Anda di halaman profil terlebih dahulu.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowProfileCompletionModal(false)}
                                className="px-6 py-2 text-gray-700 border rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Nanti Saja
                            </button>
                            <Link
                                href={route('profile.show')}
                                onClick={() => setShowProfileCompletionModal(false)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Lengkapi Profil
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {showAddAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Tambah Alamat Baru</h3>
                            <button onClick={() => setShowAddAddressModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                        </div>
                        {addAddressError && <p className="text-red-500 text-sm mb-3 p-2 bg-red-100 border border-red-300 rounded">{addAddressError}</p>}
                        <form onSubmit={handleAddNewAddress}>
                            <div className="space-y-3">
                                <input type="text" name="street" value={newAddress.street} onChange={handleNewAddressChange} placeholder="Nama Jalan, No. Rumah" className="w-full p-2 border rounded" required />
                                <input type="text" name="more" value={newAddress.more} onChange={handleNewAddressChange} placeholder="Detail Tambahan (Blok, Unit, Patokan)" className="w-full p-2 border rounded" />
                                <input type="text" name="city" value={newAddress.city} onChange={handleNewAddressChange} placeholder="Kota/Kabupaten" className="w-full p-2 border rounded" required />
                                <input type="text" name="province" value={newAddress.province} onChange={handleNewAddressChange} placeholder="Provinsi" className="w-full p-2 border rounded" required />
                                <input type="text" name="post_code" value={newAddress.post_code} onChange={handleNewAddressChange} placeholder="Kode Pos" className="w-full p-2 border rounded" required />
                                <input type="text" name="country" value={newAddress.country} onChange={handleNewAddressChange} placeholder="Negara" className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAddAddressModal(false)} className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100" disabled={isAddingAddress}>Batal</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300" disabled={isAddingAddress}>{isAddingAddress ? 'Menyimpan...' : 'Simpan Alamat'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        {* Coba nanti hapus bawah ini kalo ngga kepake, Ridho. *}
        {*<div className="container mx-auto px-4 py-6 max-w-4xl">
                    {items.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-600 mb-2">Keranjang Kosong</h2>
                            <p className="text-gray-500">Belum ada item dalam keranjang belanja Anda</p>
                        </div>
                    ) : (
                        <>
                            {/* Delivery Address */}
                            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Seinal</h3>
                                        <p className="text-sm text-gray-600">(+62) 823-4567-8912</p>
                                        <p className="text-sm text-gray-600">Jl telang indah 2 timur</p>
                                        <p className="text-sm text-gray-600">KAMAL, KAB. BANGKALAN, JWA TIMUR, ID 69162</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="bg-white rounded-lg shadow-sm mb-4">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                                    {item.quantity}x
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                                    <p className="text-green-600 font-semibold">
                                                        {formatCurrency(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Voucher Section */}
                            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">Pilih Voucher Diskonmu, lebih hemat dengan potongan harga</span>
                                    <ArrowRight className="w-5 h-5 text-green-600" />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal :</span>
                                        <span className="font-semibold">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Diskon :</span>
                                        <span className="font-semibold text-green-600">-{formatCurrency(discount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ongkir :</span>
                                        <span className="font-semibold">{formatCurrency(shipping)}</span>
                                    </div>
                                    <hr className="my-3" />
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold">Total bayar</span>
                                        <span className="font-bold text-green-600">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                                    <Truck className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                    <h3 className="font-semibold text-gray-800">Delivery</h3>
                                    <p className="text-sm text-gray-600">Gratis ongkir ke seluruh telang</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center shadow-sm opacity-50">
                                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <h3 className="font-semibold text-gray-500">Ambil langsung di toko</h3>
                                    <p className="text-sm text-gray-500">Cepat, langsung siap</p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                                <h3 className="font-semibold text-gray-800 mb-3">Metode Pembayaran</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cash"
                                            checked={data.payment_method === 'cash'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="text-green-600"
                                        />
                                        <span>Tunai (Cash)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="bank"
                                            checked={data.payment_method === 'bank'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="text-green-600"
                                        />
                                        <span>Transfer Bank</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="e-wallet"
                                            checked={data.payment_method === 'e-wallet'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="text-green-600"
                                        />
                                        <span>E-Wallet</span>
                                    </label>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catatan Pesanan (Opsional)
                                </label>
                                <textarea
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    placeholder="Tambahkan catatan untuk pesanan Anda..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={processing}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Checkout!
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>*}
        </AppTemplate>
    );
}