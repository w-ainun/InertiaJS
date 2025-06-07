import React, { useState, useEffect, FormEvent } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AppTemplate from '@/components/templates/app-template';
import { ShoppingCart, MapPin, Truck, Building, ArrowRight, PlusCircle, Home, X, AlertTriangle, User, Phone } from 'lucide-react';
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

interface ContactWithAddresses {
    id: number;
    name: string;
    phone: string;
    addresses: AddressProps[];
}

interface UserInfo {
    name: string;
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
    selected_contact_id: number | null; // Added for contact selection
    [key: string]: any;
}

interface CartPageProps {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    contactsWithAddresses: ContactWithAddresses[]; // Changed from 'addresses'
    user: UserInfo;
    errors: Errors & ErrorBag;
    flash: {
        success?: string;
        error?: string;
        info?: string;
    };
}

export default function Cart(props: CartPageProps) {
    const {
        items,
        subtotal,
        discount,
        shipping,
        contactsWithAddresses: initialContacts,
        user,
        errors: serverErrors,
        flash
    } = props;

    const getDefaultContactId = () => {
        if (initialContacts.length > 0 && initialContacts[0].addresses.length > 0) {
            return initialContacts[0].id;
        }
        return null;
    };

    const getDefaultAddressId = (contactId: number | null) => {
        if (!contactId) return null;
        const contact = initialContacts.find(c => c.id === contactId);
        if (contact && contact.addresses.length > 0) {
            return contact.addresses[0].id ?? null;
        }
        return null;
    };

    const defaultContactId = getDefaultContactId();

    const { data, setData, post, processing, errors: formErrors } = useForm<CheckoutFormData>({
        note: '',
        delivery_option: 'delivery',
        selected_contact_id: defaultContactId,
        selected_address_id: getDefaultAddressId(defaultContactId),
    });

    const [currentShippingCost, setCurrentShippingCost] = useState(shipping);
    const [pageMessage, setPageMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (flash?.success) setPageMessage({ type: 'success', text: flash.success });
        if (flash?.error) setPageMessage({ type: 'error', text: flash.error });
        if (flash?.success || flash?.error || flash?.info) {
            const timer = setTimeout(() => setPageMessage(null), 7000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        if (data.delivery_option === 'pickup') {
            setCurrentShippingCost(0);
        } else {
            setCurrentShippingCost(shipping);
            if (!data.selected_contact_id && initialContacts.length > 0) {
                const newDefaultContactId = getDefaultContactId();
                setData(prev => ({
                    ...prev,
                    selected_contact_id: newDefaultContactId,
                    selected_address_id: getDefaultAddressId(newDefaultContactId)
                }));
            }
        }
    }, [data.delivery_option, shipping, initialContacts]);

    const finalTotal = subtotal - discount + currentShippingCost;

    const updateQuantity = (itemId: number, newQuantity: number) => {
        router.patch(route('client.cart.update'), {
            item_id: itemId,
            quantity: newQuantity
        }, { preserveScroll: true, onSuccess: () => window.dispatchEvent(new Event('cart-updated')) });
    };

    const removeItem = (itemId: number) => {
        if (confirm('Are you sure you want to remove this item from the cart?')) {
            router.delete(route('client.cart.remove'), {
                data: { item_id: itemId },
                preserveScroll: true,
                onSuccess: () => window.dispatchEvent(new Event('cart-updated')),
            });
        }
    };

    const handleSelectContact = (contactId: number) => {
        const selectedContact = initialContacts.find(c => c.id === contactId);
        setData(prev => ({
            ...prev,
            selected_contact_id: contactId,
            selected_address_id: selectedContact?.addresses[0]?.id ?? null
        }));
    };

    const handleCheckout = () => {
        if (data.delivery_option === 'delivery' && !data.selected_contact_id) {
            setPageMessage({ type: 'error', text: 'Please select a recipient contact.' });
            return;
        }
        if (data.delivery_option === 'delivery' && !data.selected_address_id) {
            setPageMessage({ type: 'error', text: 'Please select a delivery address.' });
            return;
        }
        post(route('client.cart.checkout'), {
            onSuccess: () => window.dispatchEvent(new Event('cart-updated')),
        });
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(amount).replace(/\s*IDR\s*/, 'Rp');
    };

    return (
        <AppTemplate>
            <Head title="Shopping Cart" />
            <div className="min-h-screen bg-gray-100">
                <div className="bg-green-600 text-white py-6 shadow-md">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-8 h-8" />
                            <h1 className="text-2xl font-bold">Shopping Cart</h1>
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
                            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Your Cart is Empty</h2>
                            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                            <Link
                                href={route('Homepage')}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                            <MapPin className="w-6 h-6 text-orange-500 mr-3" /> Shipping Info
                                        </h2>
                                        {data.delivery_option === 'delivery' && (
                                            <Link
                                                href={route('profile.show')}
                                                className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md flex items-center"
                                            > <PlusCircle className="w-4 h-4 mr-1" /> Manage Contacts & Addresses
                                            </Link>
                                        )}
                                    </div>

                                    {data.delivery_option === 'delivery' ? (
                                        initialContacts.length > 0 ? (
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-gray-700">Select Recipient Contact:</h3>
                                                <div className="space-y-3">
                                                    {initialContacts.map((contact) => (
                                                        <div key={contact.id}>
                                                            <label
                                                                onClick={() => handleSelectContact(contact.id)}
                                                                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${data.selected_contact_id === contact.id ? 'border-green-500 ring-2 ring-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}
                                                            >
                                                                <div className="flex-shrink-0 mt-1 mr-3">
                                                                    <User className="w-5 h-5 text-gray-600" />
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <span className="font-semibold text-gray-800">{contact.name}</span>
                                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                                        <Phone size={14} /> {contact.phone}
                                                                    </p>
                                                                </div>
                                                                <input type="radio" name="selected_contact_id" value={contact.id} checked={data.selected_contact_id === contact.id} readOnly className="h-4 w-4 text-green-600" />
                                                            </label>

                                                            {data.selected_contact_id === contact.id && (
                                                                <div className="pl-8 pt-3 space-y-2">
                                                                    {contact.addresses.length > 0 ? (
                                                                        contact.addresses.map(address => (
                                                                            <label key={address.id} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${data.selected_address_id === address.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                                                <input type="radio" name="selected_address_id" value={address.id} checked={data.selected_address_id === address.id} onChange={(e) => setData('selected_address_id', parseInt(e.target.value))} className="mt-1 mr-3 h-4 w-4 text-blue-600" />
                                                                                <div>
                                                                                    <p className="text-sm text-gray-700 font-medium">Shipping Address</p>
                                                                                    <p className="text-sm text-gray-600">{address.summary}</p>
                                                                                </div>
                                                                            </label>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">This contact has no saved addresses.</p>
                                                                    )}
                                                                    {formErrors.selected_address_id && <p className="text-red-500 text-sm mt-1">{formErrors.selected_address_id}</p>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {formErrors.selected_contact_id && <p className="text-red-500 text-sm mt-1">{formErrors.selected_contact_id}</p>}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                                <Home className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                                <p className="text-gray-600 mb-2">You have no saved contacts & addresses.</p>
                                                <Link href={route('profile.show')} className="text-green-600 hover:underline">
                                                    Complete your profile now
                                                </Link>
                                            </div>
                                        )
                                    ) : (
                                        <p className="text-gray-500 text-sm">Store pickup selected. Shipping info not required.</p>
                                    )}
                                </div>

                                <div className="bg-white rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200"> Items in Cart ({items.length}) </h2>
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 border-b last:border-b-0 hover:bg-gray-50">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                                        <p className="text-green-600 font-semibold text-sm">{formatCurrency(item.price)} / {item.unit}</p>
                                                        {item.discount > 0 && (<p className="text-xs text-red-500">Discount {item.discount}%</p>)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50" disabled={item.quantity <= 0 || processing}>-</button>
                                                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50" disabled={processing}>+</button>
                                                    <button onClick={() => removeItem(item.id)} className="ml-3 text-red-500 hover:text-red-700 disabled:opacity-50" disabled={processing}>Remove</button>
                                                </div>
                                            </div>
                                            <p className="text-right font-semibold mt-2 sm:mt-0">Item Subtotal: {formatCurrency(item.discounted_total)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">Retrieval Option</h3>
                                    <div className="space-y-3">
                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${data.delivery_option === 'delivery' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200'}`}>
                                            <input type="radio" name="delivery_option" value="delivery" checked={data.delivery_option === 'delivery'} onChange={(e) => setData('delivery_option', e.target.value as 'delivery')} className="h-4 w-4 text-green-600" disabled={processing} />
                                            <Truck className="w-6 h-6 text-green-600" />
                                            <div><span className="font-medium">Delivery</span><p className="text-xs text-gray-500">Will be sent to your address.</p></div>
                                        </label>
                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${data.delivery_option === 'pickup' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200'}`}>
                                            <input type="radio" name="delivery_option" value="pickup" checked={data.delivery_option === 'pickup'} onChange={(e) => setData('delivery_option', e.target.value as 'pickup')} className="h-4 w-4 text-green-600" disabled={processing} />
                                            <Building className="w-6 h-6 text-blue-600" />
                                            <div><span className="font-medium">Store Pickup</span><p className="text-xs text-gray-500">Ready for pickup at the store.</p></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">Order Summary</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span className="text-gray-600">Product Subtotal:</span><span className="font-semibold">{formatCurrency(subtotal)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">Total Product Discount:</span><span className="font-semibold text-red-500">-{formatCurrency(discount)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">Shipping Cost:</span><span className="font-semibold">{formatCurrency(currentShippingCost)}</span></div>
                                        <hr className="my-3" />
                                        <div className="flex justify-between text-lg"><span className="font-bold">Total Payment</span><span className="font-bold text-green-600">{formatCurrency(finalTotal)}</span></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <label htmlFor="order_note" className="block text-sm font-medium text-gray-700 mb-2">Order Note (Optional)</label>
                                    <textarea id="order_note" value={data.note} onChange={(e) => setData('note', e.target.value)} placeholder="Add a note for your order..." className="w-full px-3 py-2 border rounded-lg focus:ring-green-500" rows={3} disabled={processing} />
                                </div>
                                <button onClick={handleCheckout} disabled={processing || items.length === 0 || (data.delivery_option === 'delivery' && !data.selected_address_id)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60">
                                    {processing ? 'Processing...' : 'Proceed to Payment'} <ArrowRight className="w-5 h-5" />
                                </button>
                                {data.delivery_option === 'delivery' && !data.selected_address_id && initialContacts.length > 0 && (<p className="text-red-500 text-sm mt-2 text-center">Please select a contact and shipping address.</p>)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppTemplate>
    );
}