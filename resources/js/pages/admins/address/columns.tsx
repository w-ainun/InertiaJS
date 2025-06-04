'use client';

import type { Address } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import { Building, Clock, Copy, ExternalLink, Home, Mail, MapPin, Navigation, Phone, Trash2, User } from 'lucide-react';

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

// Helper function to format full address
const formatFullAddress = (address: Address): string => {
  const parts = [address.street, address.more, address.city, address.province, address.country, address.post_code].filter(Boolean);

  return parts.join(', ');
};

// Helper function to format phone number
const formatPhoneNumber = (phone: string): string => {
  if (phone.startsWith('08')) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+62 ${cleaned.substring(1, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8)}`;
    }
  }
  return phone;
};

// Helper function to get country flag emoji
const getCountryFlag = (country: string): string => {
  const countryFlags: { [key: string]: string } = {
    Indonesia: '🇮🇩',
    Malaysia: '🇲🇾',
    Singapore: '🇸🇬',
    Thailand: '🇹🇭',
    Philippines: '🇵🇭',
    Vietnam: '🇻🇳',
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    Australia: '🇦🇺',
    Japan: '🇯🇵',
    'South Korea': '🇰🇷',
    China: '🇨🇳',
  };

  return countryFlags[country] || '🌍';
};

// Helper function to render user role badge
const getUserRoleBadge = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return (
        <Badge variant="purple" className="gap-1.5">
          <User className="h-3 w-3" />
          Admin
        </Badge>
      );
    case 'CLIENT':
      return (
        <Badge variant="cyan" className="gap-1.5">
          <User className="h-3 w-3" />
          Client
        </Badge>
      );
    case 'COURIER':
      return (
        <Badge variant="orange" className="gap-1.5">
          <User className="h-3 w-3" />
          Courier
        </Badge>
      );
    default:
      return (
        <Badge variant="muted" className="gap-1.5">
          <User className="h-3 w-3" />
          {role}
        </Badge>
      );
  }
};

// Helper function to copy to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // You can add toast notification here
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

export const columns: ColumnDef<Address, string>[] = [
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
    accessorKey: 'contact',
    header: 'Contact Owner',
    cell: ({ row }) => {
      const address = row.original;
      const contact = address.contact;
      const user = contact?.user;

      if (!contact) {
        return <span className="text-muted-foreground text-sm">No contact</span>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3">
                <Avatar className="border-border h-12 w-12 overflow-hidden rounded-full border-2">
                  <AvatarImage src={contact.profile ? `/storage/${contact.profile}` : '/placeholder.svg'} alt={contact.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 font-medium">
                    <User className="text-muted-foreground h-3.5 w-3.5" />
                    <span
                      className={`${contact.deleted_at ? 'text-red-500 line-through' : ''}`}
                      title={contact.deleted_at ? 'Contact has been deleted' : ''}
                    >
                      {contact.name}
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                    <Phone className="h-3 w-3" />
                    {formatPhoneNumber(contact.phone)}
                  </div>
                  {user && <div className="mt-1 flex items-center gap-1">{getUserRoleBadge(user.role)}</div>}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-semibold">Contact Information:</p>
                  <p>Name: {contact.name}</p>
                  <p>Phone: {contact.phone}</p>
                  <p>Gender: {contact.gender}</p>
                  {contact.birthday && <p>Birthday: {format(new Date(contact.birthday), 'dd MMM yyyy')}</p>}
                </div>
                {user && (
                  <div>
                    <p className="font-semibold">Owner Information:</p>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Status: {user.status}</p>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'full_address',
    header: 'Contact Address',
    cell: ({ row }) => {
      const address = row.original;
      const fullAddress = formatFullAddress(address);
      const isDeleted = !!address.deleted_at;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[220px]">
                <div className="mb-2 flex items-center gap-1.5">
                  <Navigation className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-sm font-medium">Full Address</span>
                  {isDeleted && <p className="mt-2 text-xs text-red-500 italic">(Deleted)</p>}
                </div>

                <div className="flex flex-wrap gap-1">
                  <Button variant="outline" size="sm" className="h-6 text-xs" asChild>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Maps
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 text-xs" onClick={() => copyToClipboard(fullAddress)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <div className="text-xs">
                <p className="mb-1 font-semibold">Complete Address:</p>
                <p className="whitespace-pre-wrap">{fullAddress}</p>
                <div className="mt-2 border-t pt-2">
                  <p className="mb-1 font-semibold">Address Details:</p>
                  <p>Street: {address.street}</p>
                  {address.more && <p>Additional: {address.more}</p>}
                  <p>City: {address.city}</p>
                  <p>Province: {address.province}</p>
                  <p>Country: {address.country}</p>
                  <p>Postal Code: {address.post_code}</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'city',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="City" />,
    cell: ({ row }) => {
      const address = row.original;
      const city = row.getValue('city') as string;
      const province = address.province;
      const country = address.country;

      return (
        <div className="flex max-w-[150px] flex-col">
          <div className="flex items-center gap-1 font-medium">
            <Building className="text-muted-foreground h-3.5 w-3.5" />
            <span className="truncate">{city}</span>
          </div>
          <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{province}</span>
          </div>
          <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
            <span className="mr-1">{getCountryFlag(country)}</span>
            <span className="truncate">{country}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'street',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Street" />,
    cell: ({ row }) => {
      const address = row.original;
      const street = row.getValue('street') as string;
      const more = address.more;

      return (
        <div className="flex max-w-[180px] flex-col">
          <div className="flex items-center gap-1 font-medium">
            <Home className="text-muted-foreground h-3.5 w-3.5" />
            <span className="truncate">{street}</span>
          </div>
          {more && <div className="text-muted-foreground mt-0.5 truncate text-xs">{more}</div>}
          <div className="mt-1 flex items-center gap-1">
            <Badge variant="outline" className="font-mono text-xs">
              <Mail className="mr-1 h-3 w-3" />
              {address.post_code}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Added" />,
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
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Updated" />,
    cell: ({ row }) => {
      const updated_at = row.getValue('updated_at') as string;

      if (!updated_at) return null;

      const date = new Date(updated_at);
      const formattedDate = formatDistanceToNow(date);

      return <Badge variant="default">{formattedDate}</Badge>;
    },
  },
  {
    accessorKey: 'deleted_at',
    header: ({ column }) => <DataTableColumnHeader<Address, unknown> column={column} title="Deleted" />,
    cell: ({ row }) => {
      const deletedAt = row.getValue('deleted_at') as string;
      if (!deletedAt) return null;

      return (
        <Badge variant="destructive" className="gap-1.5">
          <Trash2 className="h-3 w-3" />
          Deleted
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const address = row.original;
      const isDeleted = !!address.deleted_at;

      return (
        <div className="flex gap-2">
          {isDeleted ? (
            <>
              <ShowButton endpoint="addres" id={String(address.id)} />
              <RestoreModal resourceName="addres" id={address.id} />
            </>
          ) : (
            <>
              <EditButton endpoint="addres" id={String(address.id)} />
              <DeleteModal resourceName="addres" id={address.id} />
            </>
          )}
        </div>
      );
    },
  },
];
