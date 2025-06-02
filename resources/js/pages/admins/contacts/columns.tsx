import { Contact } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

import Checkbox from '@/components/elements/checkbox';
import { DataTableColumnHeader } from '@/components/templates/data-table-header';
import { DeleteModal } from '@/components/templates/delete-modal';
import { EditButton } from '@/components/templates/edit-button';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const columns: ColumnDef<Contact, string>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'profile',
    header: 'Profile',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const getInitials = useInitials();
      return (
        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
          <AvatarImage src={'/storage/' + row.getValue('profile')} alt={row.getValue('name')} />
          <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
            {getInitials(row.getValue('name'))}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="name" />,
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="phone" />,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="gender" />,
    cell: ({ row }) => <Badge variant={row.getValue('gender') === 'active' ? 'default' : 'muted'}>{row.getValue('gender')}</Badge>,
  },
  {
    accessorKey: 'birthday',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="birthday" />,
    cell: ({ row }) => <div>{row.getValue('birthday')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="flex gap-5">
          <EditButton endpoint="contact" id={String(contact.id)} />
          <DeleteModal resourceName="contact" id={contact.id} />
        </div>
      );
    },
  },
];
