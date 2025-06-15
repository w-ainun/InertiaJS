import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Head, useForm } from '@inertiajs/react';

import Input from '@/components/elements/input';
import { Button } from '@/components/elements/button';
import InputError from '@/components/elements/input-error';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } =
    useForm<Required<{ email: string }>>({
      email: '',
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.email'));
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
            <Head title="Forgot Password" />
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Lupa Password</h2>
              <p className="text-gray-600 text-sm">
                Lupa kata sandi Anda? Tidak masalah. Beri tahu kami alamat email Anda dan kami akan mengirimkan tautan pengaturan ulang kata sandi melalui email.
              </p>
            </div>

            {status && (
              <div className="mb-4 font-medium text-sm text-green-600">
                {status}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={submit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-green-50 border-green-100 focus:border-[#51793E] focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  autoFocus
                  autoComplete="username"
                />
                <InputError message={errors.email} />
              </div>

              <div className="flex justify-center mt-2">
                <Button
                  type="submit"
                  className="bg-[#51793E] hover:bg-[#3f5d31] text-white flex items-center justify-center py-2 px-6 rounded-md w-full"
                  disabled={processing}
                >
                  {processing ? (
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <>
                      KIRIM TAUTAN RESET
                      <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}