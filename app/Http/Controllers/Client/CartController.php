<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Address;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Midtrans\Config as MidtransConfig;
use Midtrans\Snap as MidtransSnap;
use Carbon\Carbon;

class CartController extends Controller
{
    public function __construct()
    {
        MidtransConfig::$serverKey = config('midtrans.server_key');
        MidtransConfig::$isProduction = config('midtrans.is_production');
        MidtransConfig::$isSanitized = config('midtrans.is_sanitized');
        MidtransConfig::$is3ds = config('midtrans.is_3ds');
    }

    public function index()
    {
        $cartItemsSession = session('cart', []);
        $items = [];
        $subtotal = 0;
        $totalItemDiscount = 0;
        $userContactsWithAddresses = [];
        $authUser = Auth::user();

        if ($authUser) {
            // Eager load contacts and their addresses
            $authUser->load('contacts.addresses');

            // Restructure data for the frontend
            $userContactsWithAddresses = $authUser->contacts->map(function ($contact) {
                return [
                    'id' => $contact->id,
                    'name' => $contact->name,
                    'phone' => $contact->phone,
                    'addresses' => $contact->addresses->map(function ($address) {
                        return [
                            'id' => $address->id,
                            'post_code' => $address->post_code,
                            'country' => $address->country,
                            'province' => $address->province,
                            'city' => $address->city,
                            'street' => $address->street,
                            'more' => $address->more,
                            'summary' => trim(implode(', ', array_filter([
                                $address->street,
                                $address->more,
                                $address->city,
                                $address->province,
                                $address->post_code,
                                $address->country
                            ]))),
                        ];
                    }),
                ];
            })->values()->all();
        }

        if (!empty($cartItemsSession)) {
            $dbItems = Item::whereIn('id', array_keys($cartItemsSession))->get()->keyBy('id');
            foreach ($cartItemsSession as $itemId => $cartEntry) {
                $itemModel = $dbItems->get($itemId);
                $quantity = is_array($cartEntry) && isset($cartEntry['quantity'])
                    ? (int)$cartEntry['quantity']
                    : (int)$cartEntry;


                if ($itemModel) {
                    $itemOriginalTotal = $itemModel->price * $quantity;
                    $itemDiscountAmount = $itemOriginalTotal * ($itemModel->discount / 100);
                    $itemDiscountedTotal = $itemOriginalTotal - $itemDiscountAmount;

                    $items[] = [
                        'id' => $itemModel->id,
                        'name' => $itemModel->name,
                        'price' => (float)$itemModel->price,
                        'quantity' => (int)$quantity,
                        'unit' => $itemModel->unit,
                        'discount' => (float)$itemModel->discount,
                        'total' => (float)$itemOriginalTotal,
                        'discounted_total' => (float)$itemDiscountedTotal,
                    ];
                    $subtotal += $itemOriginalTotal;
                    $totalItemDiscount += $itemDiscountAmount;
                }
            }
        }

        $shippingCostForDelivery = (float) config('shop.delivery_fee', 0);
        $grandTotal = ($subtotal - $totalItemDiscount) + $shippingCostForDelivery;

        return Inertia::render('clients/Cart', [
            'items' => $items,
            'subtotal' => (float)$subtotal,
            'discount' => (float)$totalItemDiscount,
            'shipping' => (float)$shippingCostForDelivery,
            'total' => (float)$grandTotal,
            'contactsWithAddresses' => $userContactsWithAddresses, // Send new structured data
            'user' => [
                'name' => $authUser ? $authUser->name : 'Guest',
                'email' => $authUser ? $authUser->email : null,
            ],
        ]);
    }

    public function getCartData()
    {
        $cartItemsSession = session('cart', []);
        $itemCount = 0;
        $totalValue = 0;

        if (!empty($cartItemsSession)) {
            $itemIds = array_keys($cartItemsSession);
            $dbItems = Item::whereIn('id', $itemIds)->get()->keyBy('id');

            $itemCount = count($cartItemsSession);

            foreach ($cartItemsSession as $itemId => $cartEntry) {
                $item = $dbItems->get($itemId);
                $quantity = is_array($cartEntry) && isset($cartEntry['quantity'])
                    ? (int)$cartEntry['quantity']
                    : (int)$cartEntry;

                if ($item) {
                    $pricePerUnitAfterDiscount = $item->price * (1 - ($item->discount / 100));
                    $totalValue += $pricePerUnitAfterDiscount * $quantity;
                }
            }
        }

        return response()->json([
            'count' => $itemCount,
            'total' => round($totalValue)
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = session('cart', []);
        $itemId = $request->item_id;
        $quantity = (int)$request->quantity;

        if (isset($cart[$itemId])) {
            $currentQuantity = (int)$cart[$itemId];
            $cart[$itemId] = $currentQuantity + $quantity;
        } else {
            $cart[$itemId] = $quantity;
        }
        session(['cart' => $cart]);

        return back()->with('success', 'Item added to cart successfully!');
    }

    public function updateCart(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:0'
        ]);

        $cart = session('cart', []);
        $itemId = $request->item_id;
        $quantity = (int)$request->quantity;

        if ($quantity > 0) {
            $cart[$itemId] = $quantity;
        } else {
            unset($cart[$itemId]);
        }

        session(['cart' => $cart]);

        return back()->with('success', 'Cart updated successfully!');
    }

    public function removeFromCart(Request $request)
    {
        $request->validate(['item_id' => 'required|exists:items,id']);
        $cart = session('cart', []);
        unset($cart[$request->item_id]);
        session(['cart' => $cart]);

        return back()->with('success', 'Item removed from cart successfully!');
    }

    public function checkout(Request $request)
    {
        $validationRules = [
            'note' => 'nullable|string|max:1000',
            'delivery_option' => 'required|in:delivery,pickup',
            'selected_contact_id' => 'required_if:delivery_option,delivery|nullable|exists:contacts,id', // New validation
            'selected_address_id' => 'required_if:delivery_option,delivery|nullable|exists:addresses,id', // New validation
        ];
        $validationMessages = [
            'selected_contact_id.required_if' => 'Please select a recipient contact.',
            'selected_address_id.required_if' => 'Please select a delivery address.',
        ];

        $request->validate($validationRules, $validationMessages);


        $cart_items_session = session('cart', []);

        if (empty($cart_items_session)) {
            return back()->withErrors(['cart' => 'Your cart is empty!'])->withInput();
        }

        $authUser = Auth::user();
        $selectedAddress = null;
        $customerContactPhoneForMidtrans = null;
        $shippingContactPhoneForMidtrans = null;
        $shippingContactNameForMidtrans = $authUser->name;

        if ($request->delivery_option === 'delivery') {
            $selectedContact = Contact::find($request->selected_contact_id);
            $selectedAddress = Address::find($request->selected_address_id);

            // Critical validation: ensure the address belongs to the contact, and the contact belongs to the user
            if (!$selectedContact || $selectedContact->user_id !== $authUser->id) {
                return back()->withErrors(['selected_contact_id' => 'The selected contact is invalid.'])->withInput();
            }
            if (!$selectedAddress || $selectedAddress->contact_id !== $selectedContact->id) {
                return back()->withErrors(['selected_address_id' => 'The selected address does not match the recipient contact.'])->withInput();
            }
            
            $customerContactPhoneForMidtrans = $selectedContact->phone;
            $shippingContactPhoneForMidtrans = $selectedContact->phone;
            $shippingContactNameForMidtrans = $selectedContact->name;
        } else { // Pickup
            $authUser->loadMissing('contacts');
            if ($authUser->contacts->isNotEmpty() && $authUser->contacts->first()->phone) {
                $customerContactPhoneForMidtrans = $authUser->contacts->first()->phone;
            }
        }

        DB::beginTransaction();
        $midtrans_params = [];

        try {
            $calculatedSubtotal = 0;
            $calculatedTotalItemDiscount = 0;
            $transactionDetailsData = [];
            $midtransItemDetails = [];
            $finalNote = $request->note ?? '';

            $shippingCost = 0;
            $pickupDeadline = null;

            if ($request->delivery_option === 'delivery' && $selectedAddress) {
                $shippingCost = (float) config('shop.delivery_fee', 0);
                $addressSummary = trim(implode(', ', array_filter([
                    $selectedAddress->street, $selectedAddress->more, $selectedAddress->city,
                    $selectedAddress->province, $selectedAddress->post_code, $selectedAddress->country
                ])));
                $finalNote = "Recipient: {$shippingContactNameForMidtrans}\n" . 
                             "Delivery to: " . $addressSummary . "\n---\n" . $finalNote;
            } elseif ($request->delivery_option === 'pickup') {
                $finalNote = "Pickup from store.\n---\n" . $finalNote;
                $shippingCost = 0;
                $pickup_window_hours = config('shop.pickup_window_hours', 48);
                $pickupDeadline = Carbon::now()->addHours($pickup_window_hours);
            }

            $itemIds = array_keys($cart_items_session);
            $dbItems = Item::whereIn('id', $itemIds)->get()->keyBy('id');

            foreach ($cart_items_session as $itemId => $cartQuantityOrDetails) {
                $item = $dbItems->get($itemId);
                $quantity = is_array($cartQuantityOrDetails) && isset($cartQuantityOrDetails['quantity'])
                    ? (int)$cartQuantityOrDetails['quantity']
                    : (int)$cartQuantityOrDetails;


                if (!$item) throw new \Exception("Item with ID {$itemId} not found in database.");
                if ($item->stock < $quantity) throw new \Exception("Insufficient stock for item: {$item->name}");

                $pricePerUnitAfterDiscount = $item->price * (1 - ($item->discount / 100));
                $itemSubtotalOriginal = $item->price * $quantity;
                $itemSubtotalDiscounted = $pricePerUnitAfterDiscount * $quantity;

                $calculatedSubtotal += $itemSubtotalOriginal;
                $calculatedTotalItemDiscount += ($itemSubtotalOriginal - $itemSubtotalDiscounted);

                $transactionDetailsData[] = [
                    'item_model' => $item,
                    'quantity' => $quantity,
                    'price_at_time' => $item->price,
                    'discount_percentage_at_time' => $item->discount,
                ];

                $midtransItemDetails[] = [
                    'id'        => (string)$item->id,
                    'price'     => round($pricePerUnitAfterDiscount),
                    'quantity'  => $quantity,
                    'name'      => substr($item->name, 0, 50),
                ];
            }

            $grandTotalForTransaction = ($calculatedSubtotal - $calculatedTotalItemDiscount) + $shippingCost;

            if ($shippingCost > 0) {
                $midtransItemDetails[] = [
                    'id'        => 'SHIPPING_FEE',
                    'price'     => round($shippingCost),
                    'quantity'  => 1,
                    'name'      => 'Delivery Fee',
                ];
            }

            $grandTotalForMidtrans = 0;
            foreach ($midtransItemDetails as $mi) {
                $grandTotalForMidtrans += $mi['price'] * $mi['quantity'];
            }

            if ($grandTotalForMidtrans <= 0 && !empty($midtransItemDetails)) {
                // Handle free orders
            }


            $transaction = Transaction::create([
                'client_id' => $authUser->id,
                'total' => $grandTotalForTransaction,
                'note' => $finalNote,
                'payment_method' => 'midtrans_unspecified',
                'status' => 'pending',
                'delivery_option' => $request->delivery_option,
                'shipping_cost' => $shippingCost,
                'address_id' => ($request->delivery_option === 'delivery' && $selectedAddress) ? $selectedAddress->id : null,
                'pickup_deadline' => $pickupDeadline,
            ]);

            foreach ($transactionDetailsData as $detail) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'item_id' => $detail['item_model']->id,
                    'quantity' => $detail['quantity'],
                    'price_at_time' => $detail['price_at_time'],
                    'discount_percentage_at_time' => $detail['discount_percentage_at_time'],
                ]);
                $detail['item_model']->decrement('stock', $detail['quantity']);
            }

            $midtransOrderId = 'RB-' . $transaction->id . '-' . time();

            $customer_details = [
                'first_name' => $shippingContactNameForMidtrans, // Use selected contact name
                'email' => $authUser->email,
                'phone' => $customerContactPhoneForMidtrans,
            ];

            if ($request->delivery_option === 'delivery' && $selectedAddress) {
                $customer_details['shipping_address'] = [
                    'first_name'   => $shippingContactNameForMidtrans,
                    'phone'        => $shippingContactPhoneForMidtrans,
                    'address'      => $selectedAddress->street . ($selectedAddress->more ? ', ' . $selectedAddress->more : ''),
                    'city'         => $selectedAddress->city,
                    'postal_code'  => $selectedAddress->post_code,
                    'country_code' => 'IDN',
                ];
            }

            $midtrans_params = [
                'transaction_details' => ['order_id' => $midtransOrderId, 'gross_amount' => round($grandTotalForMidtrans)],
                'item_details'        => $midtransItemDetails,
                'customer_details'    => $customer_details,
                'callbacks' => [
                    'finish' => route('client.orders.show', ['transaction' => $transaction->id, '_from_midtrans' => '1', 'order_id' => $midtransOrderId])
                ]
            ];

            $snapToken = null;
            if ($grandTotalForMidtrans > 0) {
                $snapToken = MidtransSnap::getSnapToken($midtrans_params);
                $transaction->payment_method = 'midtrans';
                $transaction->save();
            } else {
                $transaction->status = 'paid';
                $transaction->payment_method = 'free_order';
                $transaction->save();
                DB::commit();
                session()->forget('cart');
                Log::info("Checkout for order {$transaction->id} successful (Free Order).");
                return redirect()->route('client.orders.show', $transaction->id)
                    ->with('success', 'Order placed successfully! This was a free order.');
            }

            session()->forget('cart');
            DB::commit();

            Log::info("Checkout for order {$transaction->id} successful. Midtrans Snap Token generated. Order ID for Midtrans: {$midtransOrderId}", ['params_to_midtrans' => $midtrans_params]);

            return redirect()->route('client.payment.initiate', ['transaction' => $transaction->id])
                ->with('snap_token', $snapToken)
                ->with('success_payment_initiation', 'Order placed! Redirecting to payment...');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Checkout error: ' . $e->getMessage() . ' Stack: ' . $e->getTraceAsString(), ['request' => $request->all(), 'params_sent_to_midtrans' => $midtrans_params]);
            return back()->withErrors(['checkout_error' => 'Failed to place order: ' . $e->getMessage()])->withInput();
        }
    }
}