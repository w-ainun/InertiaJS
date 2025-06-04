import { BreadcrumbItem, SharedData, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import AppLayout from '@/components/layouts/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/users',
  },
];

export default function Users() {
  const { users, success, error } = usePage<SharedData & { users: { data: User[] } }>().props;
  console.log(users);

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <DataTable<User, string>
            columns={columns}
            data={users.data}
            searchKey="username"
            create="users"
            hiddenColumns={['status', 'remember_token', 'created_at', 'updated_at', 'deleted_at']}
          />
        </div>
      </div>
    </AppLayout>
  );
}
