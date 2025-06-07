import type { Contact } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, ExternalLink, UserIcon as Female, Heart, Info, UserIcon as Male, Phone, Trash2, User } from 'lucide-react';

import { Button } from '@/components/elements/button';
import Checkbox from '@/components/elements/checkbox';
import { DataTableColumnHeader } from '@/components/templates/data-table-header';
import { DeleteModal } from '@/components/templates/delete-modal';
import { EditButton } from '@/components/templates/edit-button';
import { RestoreModal } from '@/components/templates/restore-modal';
import { ShowButton } from '@/components/templates/show-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Helper function to get initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to format phone number
const formatPhoneNumber = (phone: string): string => {
  // Basic formatting for Indonesian numbers
  if (phone.startsWith('08')) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+62 ${cleaned.substring(1, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8)}`;
    }
  }
  return phone;
};

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
      const name = row.getValue('name') as string;
      const profile = row.getValue('profile') as string;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="border-border h-10 w-10 overflow-hidden rounded-full border-2">
                <AvatarImage src={profile ? `/storage/${profile}` : '/placeholder.svg'} alt={name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="text-xs">
                <p className="font-semibold">{name}</p>
                {profile && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                    <a href={`/storage/${profile}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View full image
                    </a>
                  </Button>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Name" />,
    cell: ({ row }) => {
      const contact = row.original;
      const userInfo = contact.user;

      const isContactDeleted = !!contact.deleted_at;
      const isUserDeleted = !!userInfo?.deleted_at;

      return (
        <div className="flex flex-col">
          <div className={`flex items-center gap-1 font-medium ${isContactDeleted ? 'text-red-500' : ''}`}>
            <User className="text-muted-foreground h-3.5 w-3.5" />
            {row.getValue('name')}
          </div>

          {userInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`mt-0.5 flex items-center gap-1 text-xs ${isUserDeleted ? 'text-red-500' : 'text-muted-foreground'}`}>
                    <Info className="h-3 w-3" />
                    {userInfo.username}
                    {isUserDeleted && <span className="ml-1">(Deleted)</span>}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 text-xs">
                    <p>
                      <span className="font-semibold">Email:</span> {userInfo.email}
                    </p>
                    <p>
                      <span className="font-semibold">Role:</span> {userInfo.role}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span> {userInfo.status}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Phone" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Phone className="text-muted-foreground h-3.5 w-3.5" />
        <span className="font-mono text-sm">{formatPhoneNumber(row.getValue('phone'))}</span>
      </div>
    ),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Gender" />,
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string;

      if (gender === 'MAN') {
        return (
          <Badge variant="info" className="gap-1.5">
            <Male className="h-3 w-3" />
            Male
          </Badge>
        );
      } else if (gender === 'WOMAN') {
        return (
          <Badge variant="purple" className="gap-1.5">
            <Female className="h-3 w-3" />
            Female
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="gap-1.5">
            <User className="h-3 w-3" />
            {gender}
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: 'birthday',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Birthday" />,
    cell: ({ row }) => {
      const birthday = row.getValue('birthday') as string;

      if (!birthday) return <span className="text-muted-foreground text-sm">Not set</span>;

      const date = new Date(birthday);
      const formattedDate = format(date, 'dd MMM yyyy');
      const age = new Date().getFullYear() - date.getFullYear();

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                <span>{formattedDate}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Age: ~{age} years old</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'favourite',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Favorites" />,
    cell: ({ row }) => {
      const contact = row.original;
      const favourites = contact.favourite || [];

      if (!favourites.length) return <span className="text-muted-foreground text-sm">None</span>;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-rose-500" />
                <span>{favourites.length} items</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p className="mb-1 font-semibold">Favorite Foods:</p>
                <ul className="list-disc space-y-0.5 pl-4">
                  {favourites.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Added" />,
    cell: ({ row }) => {
      const created_at = row.getValue('created_at') as string;

      if (!created_at) return null;

      const date = new Date(created_at);
      const formattedDate = format(date, 'dd MMM yyyy');

      return (
        <div className="flex items-center gap-1.5">
          <Clock className="text-muted-foreground h-3.5 w-3.5" />
          <span className="text-muted-foreground text-sm">{formattedDate}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Updated" />,
    cell: ({ row }) => {
      const updated_at = row.getValue('updated_at') as string;

      if (!updated_at) return null;

      const date = new Date(updated_at);
      const formattedDate = formatDistanceToNow(date);
 
      return (
        <Badge variant="default">
          {formattedDate}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'deleted_at',
    header: ({ column }) => <DataTableColumnHeader<Contact, unknown> column={column} title="Deleted" />,
    cell: ({ row }) => {
      const deletedAt = row.getValue("deleted_at") as string
      if (!deletedAt) return null

      return (
        <Badge variant="destructive" className="gap-1.5">
          <Trash2 className="h-3 w-3" />
          Deleted
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const contact = row.original;
      const isDeleted = !!contact.deleted_at;

      return (
        <div className="flex gap-2">
          {isDeleted ? (
            <>
              <ShowButton endpoint="contact" id={String(contact.id)} />
              <RestoreModal resourceName="contact" id={contact.id} />
            </>
          ) : (
            <>
              <EditButton endpoint="contact" id={String(contact.id)} />
              <DeleteModal resourceName="contact" id={contact.id} />
            </>
          )}
        </div>
      );
    },
  },
];
