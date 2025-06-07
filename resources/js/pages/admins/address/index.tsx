import { toast } from 'sonner';
import { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Address, BreadcrumbItem, SharedData } from '@/types';

import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/components/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [{
  title: 'Address',
  href: '/address',
}];

export default function Users() {
  const { address, success, error } = usePage<
    SharedData & { address: { data: Address[] } }
  >().props;
  console.log(address);

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Addressess" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <DataTable<Address, string>
            columns={columns}
            data={address.data}
            searchKey="contact"
            create="address"
            hiddenColumns={['created_at', 'updated_at', 'deleted_at']}
          />
        </div>
      </div>
    </AppLayout>
  );
};