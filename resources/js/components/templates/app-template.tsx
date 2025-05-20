import HeaderLayout from '@/components/layouts/header-layout';
import NavbarLayout from '@/components/layouts/navbar-layout';
import FooterLayout from '@/components/layouts/footer-layout';
import React from 'react';
import { Link, usePage, router } from "@inertiajs/react";

type AppTemplateProps = {
  children: React.ReactNode;
  className?: string;
};

const AppTemplate: React.FC<AppTemplateProps> = ({ children, className = '' }) => {
  const { auth } = usePage().props as any;
  const user = auth?.user;

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className={`bg-[#FFFFFF] ${className}`}>
      <div className="flex justify-end items-center px-16 py-3 bg-gray-100">
      <div className="space-x-4">
  {!user ? (
    <>
      <Link href="/login" className="text-blue-600 font-medium">Login</Link>
      <Link href="/register" className="text-green-600 font-medium">Register</Link>
    </>
  ) : (
    <button onClick={handleLogout} className="text-red-600 font-medium">Logout</button>
  )}
</div>
      </div>

      {/* Komponen Layout */}
      <HeaderLayout className="flex justify-between items-center mx-16 h-14 bg-neutral-200 rounded-b-2xl" />
      <NavbarLayout className="flex justify-between items-center mx-16 my-5 font-bold" />
      {children}
      <FooterLayout className="mt-10" />
    </div>
  );
};
;

export default AppTemplate;
