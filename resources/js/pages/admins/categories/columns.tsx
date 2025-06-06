import { Category } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

import Checkbox from '@/components/elements/checkbox';
import { DataTableColumnHeader } from '@/components/templates/data-table-header';
import { DeleteModal } from '@/components/templates/delete-modal';
import { EditButton } from '@/components/templates/edit-button';
import { ShowButton } from '@/components/templates/show-button';

export const columns: ColumnDef<Category, string>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader<Category, unknown> column={column} title="Name" />,
    cell: ({ row }) => <div className="text-foreground font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'image_url',
    header: ({ column }) => <DataTableColumnHeader<Category, unknown> column={column} title="Image" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('image_url')}</div>,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader<Category, unknown> column={column} title="Description" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader<Category, unknown> column={column} title="Added" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('created_at')}</div>,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <DataTableColumnHeader<Category, unknown> column={column} title="Updated" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('updated_at')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex gap-5">
          <ShowButton endpoint="categorie" id={String(category.id)} />
          <EditButton endpoint="categorie" id={String(category.id)} />
          <DeleteModal resourceName="categorie" id={category.id} />
        </div>
      );
    },
  },
];
