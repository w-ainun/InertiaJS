import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ShoppingCart, User, Clock, ChevronLeft } from 'lucide-react';

interface PesananSayaProps {
  user?: {
    name: string;
  };
  cartItems?: {
    count: number;
    total: number;
  };
}

interface TransactionItem {
  id: number;
  date: string;
  time: string;
  item: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
}

const PesananSaya: React.FC<PesananSayaProps> = ({
  user = { name: 'Seinal Arifin' },
  cartItems = { count: 23, total: 100000 },
}) => {
  const [activeTab, setActiveTab] = useState<'pesanan' | 'riwayat'>('riwayat');

  // Transaction history data based on the image
  const transactionHistory: TransactionItem[] = [
    {
      id: 1,
      date: '05 Mar 2025',
      time: '09.45 WIB',
      item: 'Pastel',
      category: 'Gorengan',
      quantity: 1,
      price: 5000,
      image: '/img/pastel.jpg',
    },
    {
      id: 2,
      date: '05 Mar 2025',
      time: '09.45 WIB',
      item: 'Pastel',
      category: 'Gorengan',
      quantity: 1,
      price: 5000,
      image: '/img/pastel.jpg',
    },
    {
      id: 3,
      date: '05 Mar 2025',
      time: '09.45 WIB',
      item: 'Pastel',
      category: 'Gorengan',
      quantity: 1,
      price: 5000,
      image: '/img/pastel.jpg',
    }
  ];

  return (
    <>
      <Head title="Pesanan Saya - RB Store" />
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Promo Banner */}
        <div className="bg-white py-1 px-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">✨</span>
            <span className="text-sm">
              dapatkan diskon 5% pada pembelian pertama, Promo: ORDER5
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span className="text-sm">Jl. Telang Indah Barat, Bangkalan</span>
            <span className="text-green-600 text-sm ml-1 cursor-pointer">
              Change Location
            </span>
          </div>
        </div>

        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center border-b">
          <div className="text-3xl font-bold text-green-800">RB Store</div>

          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-700">
              Beranda
            </a>
            <a href="#" className="text-gray-700">
              Lihat Menu
            </a>
            <button className="bg-green-700 text-white px-4 py-2 rounded">
              Pesanan Saya
            </button>
            <div className="flex items-center ml-2 bg-gray-900 text-white px-4 py-2 rounded">
              <User size={18} className="mr-2" />
              <span>{user.name}</span>
            </div>
          </div>
        </header>

        {/* Cart Info
        <div className="bg-green-600 py-2 px-4 flex justify-end items-center">
          <div className="flex items-center text-white">
            <div className="relative mr-2">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-white text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartItems.count}
              </span>
            </div>
            <span className="mr-4">{cartItems.count} barang</span>
            <span className="mr-4">Rp {cartItems.total.toLocaleString()}</span>
            <button className="bg-white rounded-full p-1">
              <Clock size={20} className="text-green-600" />
            </button>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="flex-grow">
          {/* Page Title */}
          <div className="bg-green-700 text-white py-6 relative">
            <div className="max-w-4xl mx-auto px-4 flex items-center">
              <ChevronLeft size={24} className="cursor-pointer absolute left-4" />
              <h1 className="text-2xl font-bold text-center w-full">
                {activeTab === 'pesanan' ? 'Pesanan Saya' : 'Transaksi Saya'}
              </h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-4xl mx-auto mt-8 px-4">
            <div className="flex border-b">
              <div
                className="flex items-center mb-4 cursor-pointer"
                onClick={() => setActiveTab('pesanan')}
              >
                <div className="p-2 rounded-full border mr-3">
                  <ShoppingCart
                    size={24}
                    className={
                      activeTab === 'pesanan' ? 'text-green-600' : 'text-gray-500'
                    }
                  />
                </div>
                <span
                  className={`text-xl font-medium ${
                    activeTab === 'pesanan' ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  Pesanan
                </span>
              </div>

              <div
                className="flex items-center ml-12 mb-4 cursor-pointer"
                onClick={() => setActiveTab('riwayat')}
              >
                <div className="p-2 rounded-full border mr-3">
                  <Clock
                    size={24}
                    className={
                      activeTab === 'riwayat' ? 'text-green-600' : 'text-gray-500'
                    }
                  />
                </div>
                <span
                  className={`text-xl font-medium ${
                    activeTab === 'riwayat' ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  Riwayat Transaksi
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="mt-6">
              {activeTab === 'pesanan' && (
                <div className="text-center text-gray-500 py-8">
                  <p>Anda belum memiliki pesanan aktif saat ini.</p>
                </div>
              )}

              {activeTab === 'riwayat' && (
                <>
                  {transactionHistory.length > 0 ? (
                    <div className="space-y-4">
                      {transactionHistory.map((transaction) => (
                        <div key={transaction.id} className="bg-white rounded-lg shadow overflow-hidden">
                          {/* Delivery Info */}
                          <div className="p-4 border-b">
                            <div className="flex items-center text-gray-700">
                              <div className="bg-green-100 p-2 rounded-full mr-3">
                                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4 17H20M4 17V13C4 11.1144 4 10.1716 4.58579 9.58579C5.17157 9 6.11438 9 8 9H16C17.8856 9 18.8284 9 19.4142 9.58579C20 10.1716 20 11.1144 20 13V17M4 17L2 22H22L20 17M11 6C11 7.65685 9.65685 9 8 9C6.34315 9 5 7.65685 5 6C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6ZM19 6C19 7.65685 17.6569 9 16 9C14.3431 9 13 7.65685 13 6C13 4.34315 14.3431 3 16 3C17.6569 3 19 4.34315 19 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div>
                                <div className="text-gray-600">{transaction.date} - {transaction.time}</div>
                                <div className="font-medium">Dikirim ke Alamat</div>
                              </div>
                            </div>
                          </div>

                          {/* Item Details */}
                          <div className="p-4 flex items-center">
                            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                              <img 
                                src={transaction.image}
                                alt={transaction.item} 
                                className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="ml-4 flex-grow">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-xl font-medium">{transaction.item}</h3>
                                  <p className="text-gray-600">{transaction.category}</p>
                                  <p className="text-gray-800">{transaction.quantity}x {transaction.item}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-green-600 font-medium text-lg">Rp. {transaction.price.toLocaleString()}</div>
                                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg mt-2">
                                    beli lagi
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>Riwayat transaksi Anda kosong.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 py-10 mt-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Logo and Company Info */}
              <div>
                <div className="text-3xl font-bold text-green-800 mb-4">RB Store</div>
                <p className="text-sm text-gray-600">
                  Company # 490039-445, Registered with House of companies.
                </p>
              </div>

              {/* Newsletter */}
              <div>
                <p className="mb-4 font-medium">dapatkan penawaran special</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="youremail@gmail.com"
                    className="px-4 py-2 border rounded-l w-full"
                  />
                  <button className="bg-green-700 text-white px-4 py-2 rounded-r">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs mt-2 text-gray-600">
                  we want spam, read our email policy
                </p>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2">
                <div>
                  <p className="font-medium mb-3">Legal Pages</p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#" className="hover:text-green-700">
                        Terms and conditions
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-700">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-700">
                        Cookies
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-700">
                        Modern Slavery Statement
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-3">Important Links</p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#" className="hover:text-green-700">
                        Get help
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Sub Footer */}
        <div className="bg-gray-900 text-white py-3">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between text-sm">
            <span>Privacy Policy</span>
            <span>Terms</span>
            <span>Pricing</span>
            <span>Do not sell or share my personal information</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PesananSaya;