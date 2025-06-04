'use client';

import type { Address, BreadcrumbItem, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { differenceInDays, differenceInYears, format, formatDistanceToNow } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  Building,
  Cake,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Heart,
  Home,
  Mail,
  MapIcon,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  PhoneCall,
  Share2,
  Shield,
  Target,
  User,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/elements/button';
import Separator from '@/components/elements/separator';
import Card from '@/components/fragments/card/card';
import CardContent from '@/components/fragments/card/card-content';
import CardHeader from '@/components/fragments/card/card-header';
import CardTitle from '@/components/fragments/card/card-title';
import AppLayout from '@/components/layouts/app-layout';
import { DeleteModal } from '@/components/templates/delete-modal';
import { EditButton } from '@/components/templates/edit-button';
import { RestoreModal } from '@/components/templates/restore-modal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AddressesShow() {
  const { address, success, error } = usePage<SharedData & { address: { data: Address } }>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Addresses',
      href: route('address.index'),
    },
    {
      title: 'Details',
      href: route('address.show', address.data.id),
    },
  ];

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

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
    if (phone.startsWith('08')) {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        return `+62 ${cleaned.substring(1, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8)}`;
      }
    }
    return phone;
  };

  // Helper function to copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (err) {
      toast.error(`Failed to copy to clipboard: ${err}`);
    }
  };

  // Helper function to share address
  const shareAddress = async () => {
    const shareData = {
      title: `Address: ${address.data.street}`,
      text: `Address details for ${contact?.name || 'contact'}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Address shared successfully');
      } else {
        await copyToClipboard(window.location.href, 'Address link');
      }
    } catch (err) {
      await copyToClipboard(window.location.href, `Error msg: ${err}`);
    }
  };

  // Helper function to format full address
  const formatFullAddress = (): string => {
    const parts = [
      address.data.street,
      address.data.more,
      address.data.city,
      address.data.province,
      address.data.country,
      address.data.post_code,
    ].filter(Boolean);

    return parts.join(', ');
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
      Brunei: '🇧🇳',
      Myanmar: '🇲🇲',
      Cambodia: '🇰🇭',
      Laos: '🇱🇦',
      India: '🇮🇳',
      Germany: '🇩🇪',
      France: '🇫🇷',
      Netherlands: '🇳🇱',
    };

    return countryFlags[country] || '🌍';
  };

  // Helper function to render gender badge
  const getGenderBadge = (gender: string) => {
    if (gender === 'MAN') {
      return (
        <Badge variant="info" className="gap-1.5">
          <User className="h-3 w-3" />
          Male
        </Badge>
      );
    } else if (gender === 'WOMAN') {
      return (
        <Badge variant="purple" className="gap-1.5">
          <User className="h-3 w-3" />
          Female
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1.5">
        <User className="h-3 w-3" />
        {gender}
      </Badge>
    );
  };

  // Helper function to render user role badge
  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <Badge variant="purple" className="gap-1.5">
            <Shield className="h-3 w-3" />
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
            <Activity className="h-3 w-3" />
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

  // Helper function to render user status badge
  const getUserStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return (
          <Badge variant="success" className="gap-1.5">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge variant="inactive" className="gap-1.5">
            <XCircle className="h-3 w-3" />
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge variant="muted" className="gap-1.5">
            <XCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  // Dynamic calculations
  const isDeleted = !!address.data.deleted_at;
  const contact = address.data.contact;
  const userInfo = contact?.user;
  const isUserDeleted = !!userInfo?.deleted_at;
  const isContactDeleted = !!contact?.deleted_at;

  // Calculate real statistics
  const daysInSystem = address.data.created_at ? differenceInDays(new Date(), new Date(address.data.created_at)) : 0;

  const daysSinceUpdate = address.data.updated_at ? differenceInDays(new Date(), new Date(address.data.updated_at)) : null;

  const age = contact?.birthday ? differenceInYears(new Date(), new Date(contact.birthday)) : null;

  const fullAddress = formatFullAddress();
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(fullAddress)}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(fullAddress)}`;

  // Count favorite foods if available
  const favoriteCount = contact?.favourite?.length || 0;

  // Check if address has additional info
  const hasAdditionalInfo = !!address.data.more;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container px-4 py-8">
        {/* Hero Section with Map-like Design */}
        <div className="relative overflow-hidden rounded-2xl border">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className='bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%239C92AC" fillOpacity="0.4"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] absolute inset-0'></div>
          </div>

          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {/* Location Pin Icon */}
                <div className="relative">
                  <div className="rounded-2xl p-4 shadow-lg">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div className="absolute -right-2 -bottom-2 rounded-full bg-green-500 p-1">
                    <Target className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h1 className="text-3xl font-bold">Address Details</h1>
                    <Badge variant="outline" className="px-3 py-1 font-mono text-lg">
                      #{address.data.id}
                    </Badge>
                    {isDeleted && <Badge variant="destructive">Deleted</Badge>}
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl">{getCountryFlag(address.data.country)}</span>
                    <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                      {address.data.city}, {address.data.province}, {address.data.country}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-white/80 p-4 backdrop-blur-sm dark:bg-gray-800/80">
                    <div className="flex items-start gap-3">
                      <Navigation className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                      <div>
                        <p className="mb-1 font-semibold">Complete Address</p>
                        <p className="leading-relaxed text-gray-700 dark:text-gray-300">{fullAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(fullAddress, 'Address')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy address</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" asChild>
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                          <MapIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open in Google Maps</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={shareAddress}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share address</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {!isDeleted && (
                  <>
                    <EditButton endpoint="addres" id={String(address.data.id)} />
                    <DeleteModal resourceName="addres" id={address.data.id} />
                  </>
                )}
                {isDeleted && <RestoreModal resourceName="addres" id={address.data.id} />}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {isDeleted && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Deleted Address</AlertTitle>
            {address.data.deleted_at && (
              <AlertDescription>
                This address was deleted {formatDistanceToNow(new Date(address.data.deleted_at), { addSuffix: true })} and is no longer active in the
                system.
              </AlertDescription>
            )}
          </Alert>
        )}

        {isContactDeleted && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Contact Deleted</AlertTitle>
            <AlertDescription>The contact associated with this address has been deleted and may need attention.</AlertDescription>
          </Alert>
        )}

        {isUserDeleted && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Owner Account Deleted</AlertTitle>
            <AlertDescription>The user account that owns this address contact has been deleted.</AlertDescription>
          </Alert>
        )}

        {/* Dynamic Quick Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Postal Code</p>
                  <p className="font-mono text-2xl font-bold">{address.data.post_code}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Days in System</p>
                  <p className="text-2xl font-bold">{daysInSystem}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Status</p>
                  <p className="text-2xl font-bold">{isDeleted ? 'Deleted' : 'Active'}</p>
                </div>
                {isDeleted ? <XCircle className="h-8 w-8 text-red-500" /> : <CheckCircle className="h-8 w-8 text-purple-500" />}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Contact Status</p>
                  <p className="text-2xl font-bold">{contact ? 'Linked' : 'Unlinked'}</p>
                </div>
                <UserCheck className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Contact</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Address Details */}
              <Card className="border-muted">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Home className="text-primary h-5 w-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-muted-foreground font-medium">Street Address:</span>
                      <div className="max-w-xs text-right">
                        <p className="font-medium">{address.data.street}</p>
                        {hasAdditionalInfo && <p className="text-muted-foreground mt-1 text-sm">{address.data.more}</p>}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">City:</span>
                      <div className="flex items-center gap-2">
                        <Building className="text-muted-foreground h-4 w-4" />
                        <span className="font-medium">{address.data.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Province:</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground h-4 w-4" />
                        <span className="font-medium">{address.data.province}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Country:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCountryFlag(address.data.country)}</span>
                        <span className="font-medium">{address.data.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Postal Code:</span>
                      <Badge variant="outline" className="px-3 py-1 font-mono text-base">
                        {address.data.post_code}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-muted">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Compass className="text-primary h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="h-12 w-full justify-start" asChild>
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      <MapIcon className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Open in Google Maps</p>
                        <p className="text-muted-foreground text-xs">View location and get directions</p>
                      </div>
                    </a>
                  </Button>

                  <Button variant="outline" className="h-12 w-full justify-start" asChild>
                    <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
                      <Navigation className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Open in Waze</p>
                        <p className="text-muted-foreground text-xs">Navigate with real-time traffic</p>
                      </div>
                    </a>
                  </Button>

                  <Button variant="outline" className="h-12 w-full justify-start" onClick={() => copyToClipboard(fullAddress, 'Complete address')}>
                    <Copy className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Copy Address</p>
                      <p className="text-muted-foreground text-xs">Copy to clipboard for sharing</p>
                    </div>
                  </Button>

                  {contact && (
                    <>
                      <Separator />
                      <Button variant="outline" className="h-12 w-full justify-start" asChild>
                        <a href={`tel:${contact.phone}`}>
                          <PhoneCall className="mr-3 h-5 w-5" />
                          <div className="text-left">
                            <p className="font-medium">Call {contact.name}</p>
                            <p className="text-muted-foreground text-xs">{formatPhoneNumber(contact.phone)}</p>
                          </div>
                        </a>
                      </Button>

                      <Button variant="outline" className="h-12 w-full justify-start" asChild>
                        <a href={`sms:${contact.phone}`}>
                          <MessageCircle className="mr-3 h-5 w-5" />
                          <div className="text-left">
                            <p className="font-medium">Send SMS</p>
                            <p className="text-muted-foreground text-xs">Send message to contact</p>
                          </div>
                        </a>
                      </Button>
                    </>
                  )}

                  {!isDeleted && (
                    <>
                      <Separator />
                      <EditButton endpoint="addres" id={String(address.data.id)} />
                      <DeleteModal resourceName="addres" id={address.data.id} />
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="location" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="text-primary h-5 w-5" />
                      Geographic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Map Services */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Button variant="outline" className="h-20 flex-col" asChild>
                          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <MapIcon className="mb-2 h-6 w-6 text-blue-600" />
                            <span className="text-sm font-medium">Google Maps</span>
                          </a>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col" asChild>
                          <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
                            <Navigation className="mb-2 h-6 w-6 text-purple-600" />
                            <span className="text-sm font-medium">Waze</span>
                          </a>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col" asChild>
                          <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <Globe className="mb-2 h-6 w-6 text-gray-600" />
                            <span className="text-sm font-medium">Apple Maps</span>
                          </a>
                        </Button>
                      </div>

                      {/* Location Hierarchy */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold">
                          <Target className="h-4 w-4" />
                          Location Hierarchy
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                            <Globe className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Country</p>
                              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                <span>{getCountryFlag(address.data.country)}</span>
                                {address.data.country}
                              </p>
                            </div>
                          </div>
                          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                            <MapPin className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">Province/State</p>
                              <p className="text-muted-foreground text-sm">{address.data.province}</p>
                            </div>
                          </div>
                          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                            <Building className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="font-medium">City</p>
                              <p className="text-muted-foreground text-sm">{address.data.city}</p>
                            </div>
                          </div>
                          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                            <Home className="h-5 w-5 text-orange-500" />
                            <div>
                              <p className="font-medium">Street Address</p>
                              <p className="text-muted-foreground text-sm">{address.data.street}</p>
                              {hasAdditionalInfo && <p className="text-muted-foreground mt-1 text-xs">{address.data.more}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Postal Information */}
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mail className="text-primary h-5 w-5" />
                      Postal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-center">
                      <div className="bg-primary/10 mx-auto w-fit rounded-full p-4">
                        <Mail className="text-primary h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-mono text-2xl font-bold">{address.data.post_code}</p>
                        <p className="text-muted-foreground text-sm">Postal Code</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(address.data.post_code, 'Postal code')} className="w-full">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Dynamic Address Stats */}
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="text-primary h-5 w-5" />
                      Address Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-primary text-xl font-bold">{daysInSystem}</div>
                      <div className="text-muted-foreground text-sm">Days in System</div>
                    </div>
                    {daysSinceUpdate !== null && (
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-primary text-xl font-bold">{daysSinceUpdate}</div>
                        <div className="text-muted-foreground text-sm">Days Since Update</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            {contact ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Contact Information */}
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="text-primary h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 flex items-start gap-4">
                      <Avatar className="border-border h-16 w-16 border-4">
                        <AvatarImage
                          src={
                            contact.profile && contact.profile.startsWith('http')
                              ? contact.profile
                              : contact.profile
                                ? `/storage/${contact.profile}`
                                : '/placeholder.svg'
                          }
                          alt={contact.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{contact.name}</h3>
                          {getGenderBadge(contact.gender)}
                          {age && (
                            <Badge variant="outline" className="gap-1.5">
                              <Cake className="h-3 w-3" />
                              {age} years
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {formatPhoneNumber(contact.phone)}
                        </p>
                        {contact.birthday && (
                          <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(contact.birthday), 'dd MMM yyyy')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Contact ID:</span>
                        <Badge variant="outline" className="font-mono">
                          #{contact.id}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Gender:</span>
                        {getGenderBadge(contact.gender)}
                      </div>
                      {age && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">{age} years old</span>
                        </div>
                      )}
                      {favoriteCount > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Favorite Foods:</span>
                            <Badge variant="outline">{favoriteCount} items</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {contact.favourite?.map((item, index) => (
                              <Badge key={index} variant="outline" className="gap-1.5">
                                <Heart className="h-3 w-3 text-rose-500" />
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={`tel:${contact.phone}`}>
                          <PhoneCall className="mr-2 h-4 w-4" />
                          Call
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={`sms:${contact.phone}`}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          SMS
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={route('contacts.show', contact.id)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Information */}
                {userInfo && (
                  <Card className="border-muted">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <UserCheck className="text-primary h-5 w-5" />
                        Owner Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 flex items-start gap-4">
                        <Avatar className="border-border h-12 w-12 border-2">
                          <AvatarImage src={userInfo.avatar || '/placeholder.svg'} alt={userInfo.username} />
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 font-semibold">
                            {getInitials(userInfo.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h4 className="font-semibold">{userInfo.username}</h4>
                            {getUserRoleBadge(userInfo.role)}
                            {getUserStatusBadge(userInfo.status)}
                            {isUserDeleted && <Badge variant="destructive">Deleted</Badge>}
                          </div>
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {userInfo.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">User ID:</span>
                          <Badge variant="outline" className="font-mono">
                            #{userInfo.id}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Role:</span>
                          {getUserRoleBadge(userInfo.role)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          {getUserStatusBadge(userInfo.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Member Since:</span>
                          <span className="font-medium">
                            {userInfo.created_at ? format(new Date(userInfo.created_at), 'dd MMM yyyy') : 'Unknown'}
                          </span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" asChild className="mt-4 w-full">
                        <a href={route('users.show', userInfo.id)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View User Profile
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No Contact Information</AlertTitle>
                <AlertDescription>This address does not have an associated contact or the contact information is not available.</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <Card className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="text-primary h-5 w-5" />
                  Address Timeline & Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4 dark:bg-blue-950">
                    <div className="rounded-full bg-blue-500 p-2">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Address Created</h4>
                        <Badge variant="info">
                          {address.data.created_at ? formatDistanceToNow(new Date(address.data.created_at), { addSuffix: true }) : 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">Address was added to the system{contact ? ' and linked to contact' : ''}</p>
                      {address.data.created_at && (
                        <p className="text-muted-foreground mt-1 text-xs">{format(new Date(address.data.created_at), "PPP 'at' p")}</p>
                      )}
                    </div>
                  </div>

                  {address.data.updated_at && address.data.updated_at !== address.data.created_at && (
                    <div className="flex items-start gap-4 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950">
                      <div className="rounded-full bg-yellow-500 p-2">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-medium">Address Updated</h4>
                          <Badge variant="warning">{formatDistanceToNow(new Date(address.data.updated_at), { addSuffix: true })}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">Address information was modified ({daysSinceUpdate} days ago)</p>
                        <p className="text-muted-foreground mt-1 text-xs">{format(new Date(address.data.updated_at), "PPP 'at' p")}</p>
                      </div>
                    </div>
                  )}

                  {isDeleted && (
                    <div className="flex items-start gap-4 rounded-lg border-l-4 border-l-red-500 bg-red-50 p-4 dark:bg-red-950">
                      <div className="rounded-full bg-red-500 p-2">
                        <XCircle className="h-4 w-4" />
                      </div>
                      {address.data.deleted_at && (
                        <div className="flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-medium text-red-700 dark:text-red-300">Address Deleted</h4>
                            <Badge variant="destructive">{formatDistanceToNow(new Date(address.data.deleted_at), { addSuffix: true })}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">Address was removed from the system</p>
                          <p className="text-muted-foreground mt-1 text-xs">{format(new Date(address.data.deleted_at), "PPP 'at' p")}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-start gap-4 rounded-lg border-l-4 border-l-green-500 bg-green-50 p-4 dark:bg-green-950">
                    <div className="rounded-full bg-green-500 p-2">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Current Status</h4>
                        <Badge variant={isDeleted ? 'destructive' : 'success'}>{isDeleted ? 'Deleted' : 'Active'}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Address is currently {isDeleted ? 'deleted and inactive' : 'active and available'} in the system
                        {contact ? ' with linked contact' : ' without contact'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="bg-muted/30 mt-8 flex items-center justify-between rounded-lg p-6">
          <Button type="button" variant="outline" onClick={() => router.visit(route('address.index'))} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Addresses
          </Button>

          <div className="flex items-center gap-2">
            {isDeleted ? (
              <RestoreModal resourceName="addres" id={address.data.id} />
            ) : (
              <>
                <EditButton endpoint="addres" id={String(address.data.id)} />
                <DeleteModal resourceName="addres" id={address.data.id} />
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
