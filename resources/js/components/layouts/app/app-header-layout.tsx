import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

import { AppHeader } from '@/components/layouts/app/app-header';
import AppContent from '@/components/layouts/app/app-content';
import { AppShell } from '@/components/layouts/app/app-shell';

export default function AppHeaderLayout({
  children,
  breadcrumbs
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell>
      <AppHeader breadcrumbs={breadcrumbs} />
      <AppContent>{children}</AppContent>
    </AppShell>
  );
};
