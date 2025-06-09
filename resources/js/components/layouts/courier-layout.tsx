import { PropsWithChildren } from 'react';
import AppContent from './app/app-content';
import AppSidebar from './app/app-sidebar';
import { AppShell } from './app/app-shell';
import { AppSidebarHeader } from './app/app-sidebar-header';
import { BreadcrumbItem } from "@/types";

interface Props {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function CourierLayout({ children, breadcrumbs = [] }: Props) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar role="courier" />
      <AppContent variant="sidebar">
        <AppSidebarHeader breadcrumbs={[{ title: 'Dashboard', href: '/courier' }]} />
        {children}
      </AppContent>
    </AppShell>
  );
}
