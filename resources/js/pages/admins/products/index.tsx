import { BreadcrumbItem, Item, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import AppLayout from '@/components/layouts/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Items',
    href: route('items.index'),
  },
];

export default function Users() {
  const { items, success, error } = usePage<SharedData & { items: { data: Item[] } }>().props;
  console.log(items);

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contacts" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <DataTable<Item, string>
            columns={columns}
            data={items.data}
            searchKey="name"
            create="items"
            hiddenColumns={['description', 'discount', 'created_at', 'updated_at']}
          />
        </div>
      </div>
    </AppLayout>
  );
}
