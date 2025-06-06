import { Item } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

import Checkbox from '@/components/elements/checkbox';
import { DataTableColumnHeader } from '@/components/templates/data-table-header';
import { DeleteModal } from '@/components/templates/delete-modal';
import { EditButton } from '@/components/templates/edit-button';
import { ShowButton } from '@/components/templates/show-button';

export const columns: ColumnDef<Item, string>[] = [
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
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Name" />,
    cell: ({ row }) => <div className="text-foreground font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Unit" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('unit')}</div>,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Price" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('price')}</div>,
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Stock" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('stock')}</div>,
  },
  {
    accessorKey: 'image_url',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Image" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('image_url')}</div>,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Description" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'discount',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Discount" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('discount')}</div>,
  },
  {
    accessorKey: 'expired_at',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Expired" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('expired_at')}</div>,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Added" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('created_at')}</div>,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <DataTableColumnHeader<Item, unknown> column={column} title="Updated" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('updated_at')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex gap-5">
          <ShowButton endpoint="item" id={String(item.id)} />
          <EditButton endpoint="item" id={String(item.id)} />
          <DeleteModal resourceName="item" id={item.id} />
        </div>
      );
    },
  },
];
