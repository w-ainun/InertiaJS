import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';

import { Button } from '@/components/elements/button';

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4 flex flex-col">
      <div className="mt-4 flex justify-center lg:justify-start">
        <img 
          src="/RB-Store1.png"
          alt="RB Store Logo" 
          className="rounded-lg w-28 lg:w-35 h-auto mb-4 lg:mb-6"
        />
      </div>
      <div className="flex-grow flex flex-col lg:flex-row border border-gray-200 rounded-t-3xl lg:rounded-t-7xl overflow-hidden">
        
        {/* --- SISI KIRI (KONTEN) --- */}
        <div className="bg-white lg:w-2/3 flex flex-col p-4 lg:p-8 justify-center">
          <div className="w-full px-2 lg:px-12">
            <p className="text-[#51793E] text-base lg:text-2xl font-semibold mb-2 lg:mb-4 leading-relaxed">
              Pesan aneka kue tradisional, kudapan siap saji dan penawaran spesial lainya!
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-bold text-gray-900 mb-1 leading-tight">
              Cita Rasa Nusantara,
            </h2>
            <h3 className="text-[#51793E] text-4xl sm:text-3xl lg:text-5xl font-bold leading-tight">
              Tradisi dalam <br className="hidden sm:block"></br> Genggaman
            </h3>
            <div className="relative -mt-12 sm:-mt-20 lg:-mt-35 flex justify-center lg:justify-end lg:-mr-4 z-10">
              <img 
                src="/img/klepon.png"
                alt="Klepon - Traditional Indonesian dessert"
                className="rounded-lg w-full max-w-xs sm:max-w-sm lg:max-w-[620px] h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
        
        {/* --- SISI KANAN (FORMULIR) --- */}
        <div className="bg-[#51793E] lg:w-1/2 p-6 lg:p-12 relative rounded-tl-[120px] lg:rounded-tl-[500px] mt-12 lg:mt-0 lg:flex lg:items-center lg:justify-center"> 
          <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg relative lg:absolute z-20 lg:-mt-2 lg:translate-x-12">
            <Head title="Verifikasi Email" />
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Verifikasi Email Anda</h2>
              <p className="text-gray-600 text-sm">
                Terima kasih telah mendaftar! Sebelum memulai, bisakah Anda memverifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan melalui email kepada Anda? Jika Anda tidak menerima email tersebut, kami dengan senang hati akan mengirimkan email lainnya.
              </p>
            </div>

            {status === 'verification-link-sent' && (
              <div className="mb-4 font-medium text-sm text-green-600">
                Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat registrasi.
              </div>
            )}

            <form onSubmit={submit}>
              <div className="mt-4 flex items-center justify-between">
                <Button
                  type="submit"
                  className="bg-[#51793E] hover:bg-[#3f5d31] text-white flex items-center justify-center py-2 px-6 rounded-md"
                  disabled={processing}
                >
                  {processing ? (
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <>
                      KIRIM ULANG EMAIL VERIFIKASI
                    </>
                  )}
                </Button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Keluar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}