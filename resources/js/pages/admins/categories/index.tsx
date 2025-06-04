import { BreadcrumbItem, Category, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import AppLayout from '@/components/layouts/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Categories',
    href: route('categories.index'),
  },
];

export default function Users() {
  const { categories, success, error } = usePage<SharedData & { categories: { data: Category[] } }>().props;
  console.log(categories);

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contacts" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <DataTable<Category, string>
            columns={columns}
            data={categories.data}
            searchKey="name"
            create="categories"
            hiddenColumns={['created_at', 'updated_at']}
          />
        </div>
      </div>
    </AppLayout>
  );
}
