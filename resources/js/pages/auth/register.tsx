import { FormEventHandler, useState, useEffect, useRef } from 'react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';
import { FcGoogle } from 'react-icons/fc';

import Input from '@/components/elements/input';
import { Button } from '@/components/elements/button';
import InputError from '@/components/elements/input-error';

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } =
    useForm<Required<RegisterForm>>({
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
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
            <Head title="Sign Up" />
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign up</h2>
            </div>
            
            <form className="flex flex-col gap-4" onSubmit={submit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <Input id="username" type="text" placeholder="Username" className="w-full bg-green-50 border-green-100 focus:border-[#51793E] focus:ring focus:ring-green-200 focus:ring-opacity-50" required value={data.username} onChange={(e) => setData('username', e.target.value)} autoComplete="username" disabled={processing} />
                <InputError message={errors.username} />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input id="email" type="email" placeholder="email@example.com" className="w-full bg-green-50 border-green-100 focus:border-[#51793E] focus:ring focus:ring-green-200 focus:ring-opacity-50" required value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="email" disabled={processing} />
                <InputError message={errors.email} />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="w-full bg-green-50 border-green-100 focus:border-[#51793E] focus:ring focus:ring-green-200 focus:ring-opacity-50" required value={data.password} onChange={(e) => setData('password', e.target.value)} autoComplete="new-password" disabled={processing}/>
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (<EyeOff className="h-5 w-5 text-gray-400" />) : (<Eye className="h-5 w-5 text-gray-400" />)}
                  </button>
                </div>
                <InputError message={errors.password} />
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                <div className="relative">
                  <Input id="password_confirmation" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••••••" className="w-full bg-green-50 border-green-100 focus:border-[#51793E] focus:ring focus:ring-green-200 focus:ring-opacity-50" required value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} autoComplete="new-password" disabled={processing}/>
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (<EyeOff className="h-5 w-5 text-gray-400" />) : (<Eye className="h-5 w-5 text-gray-400" />)}
                  </button>
                </div>
                <InputError message={errors.password_confirmation} />
              </div>
              
              <div className="flex justify-center mt-2">
                <Button type="submit" className="bg-[#51793E] hover:bg-[#3f5d31] text-white flex items-center justify-center py-2 px-6 rounded-md w-full" disabled={processing}>
                  {processing ? (<LoaderCircle className="h-4 w-4 animate-spin mr-2" />) : (<>SIGN UP <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>)}
                </Button>
              </div>
            </form>
            
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 flex-shrink text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <a href={route('login.google.redirect')} className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#51793E]">
              <FcGoogle className="h-5 w-5 mr-3" />
              Sign up with Google
            </a>
            
            <div className="text-center text-gray-500 text-sm mt-6">
              I already have an account? {' '}
              <Link href={route('login')} className="text-[#51793E] hover:underline font-medium">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}