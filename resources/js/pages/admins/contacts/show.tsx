import type { BreadcrumbItem, Contact, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { differenceInYears, format, formatDistanceToNow } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  Cake,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  Shield,
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
import CardDescription from '@/components/fragments/card/card-description';
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

export default function ContactsShow() {
  const { contacts, success, error } = usePage<SharedData & { contacts: { data: Contact } }>().props;
  console.log(contacts);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Contacts',
      href: route('contacts.index'),
    },
    {
      title: 'Details',
      href: route('contacts.show', contacts.data.id),
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
      toast.error(`${err}: Failed to copy to clipboard`);
    }
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

  const isDeleted = !!contacts.data.deleted_at;
  const userInfo = contacts.data.user;
  const isUserDeleted = !!userInfo?.deleted_at;

  // Calculate age if birthday exists
  const age = contacts.data.birthday ? differenceInYears(new Date(), new Date(contacts.data.birthday)) : null;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container px-4 py-8">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="border-border h-20 w-20 border-4">
                  <AvatarImage src={contacts.data.profile ? `/storage/${contacts.data.profile}` : '/placeholder.svg'} alt={contacts.data.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-semibold text-white">
                    {getInitials(contacts.data.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="text-3xl">{contacts.data.name}</CardTitle>
                    {getGenderBadge(contacts.data.gender)}
                    {age && (
                      <Badge variant="outline" className="gap-1.5">
                        <Cake className="h-3 w-3" />
                        {age} years old
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {formatPhoneNumber(contacts.data.phone)}
                  </CardDescription>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      ID: #{contacts.data.id}
                    </Badge>
                    {userInfo && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="cursor-help gap-1.5">
                              <UserCheck className="h-3 w-3" />
                              Owner: {userInfo.username}
                              {isUserDeleted && <span className="text-red-500">(Deleted)</span>}
                            </Badge>
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
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${contacts.data.phone}`} className="flex items-center gap-1">
                          <PhoneCall className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Call {contacts.data.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`sms:${contacts.data.phone}`} className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send SMS to {contacts.data.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <EditButton endpoint="contact" id={String(contacts.data.id)} />
                <DeleteModal resourceName="contact" id={contacts.data.id} />
              </div>
            </div>

            {isDeleted && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Deleted Contact</AlertTitle>
                <AlertDescription>
                  This contact was deleted{' '}
                  {formatDistanceToNow(new Date(contacts.data.deleted_at ?? new Date()), { addSuffix: true })} and is no longer active in the system.
                </AlertDescription>
              </Alert>
            )}

            {isUserDeleted && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Owner Account Deleted</AlertTitle>
                <AlertDescription>
                  The user account that owns this contact has been deleted. This contact may need to be reassigned or removed.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>

          {/* Contact Info Summary */}
          <div className="bg-muted/20 border-b px-6 py-4">
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Birthday:</span>
                <span className="font-medium">{contacts.data.birthday ? format(new Date(contacts.data.birthday), 'dd MMM yyyy') : 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Favorites:</span>
                <span className="font-medium">{contacts.data.favourite?.length || 0} items</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Added:</span>
                <span className="font-medium">
                  {contacts.data.created_at ? formatDistanceToNow(new Date(contacts.data.created_at), { addSuffix: true }) : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium">
                  {contacts.data.updated_at ? formatDistanceToNow(new Date(contacts.data.updated_at), { addSuffix: true }) : 'Never'}
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full max-w-lg grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Personal</span>
                </TabsTrigger>
                <TabsTrigger value="owner" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Owner</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Activity</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="overview" className="mt-4 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Contact Information */}
                  <Card className="border-muted">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Phone className="text-primary h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Full Name:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{contacts.data.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(contacts.data.name, 'Name')} className="h-6 w-6 p-0">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Phone Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{formatPhoneNumber(contacts.data.phone)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(contacts.data.phone, 'Phone number')}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Gender:</span>
                        {getGenderBadge(contacts.data.gender)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Contact ID:</span>
                        <Badge variant="outline" className="font-mono">
                          #{contacts.data.id}
                        </Badge>
                      </div>
                      {contacts.data.profile && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Profile Picture:</span>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`/storage/${contacts.data.profile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="border-muted">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="text-primary h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href={`tel:${contacts.data.phone}`}>
                          <PhoneCall className="mr-2 h-4 w-4" />
                          Call {contacts.data.name}
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href={`sms:${contacts.data.phone}`}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Send SMS
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href={`https://wa.me/${contacts.data.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>
                      {!isDeleted && (
                        <>
                          <EditButton endpoint="contact" id={String(contacts.data.id)} />
                          <DeleteModal resourceName="contact" id={contacts.data.id} />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Stats */}
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="text-primary h-5 w-5" />
                      Contact Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <div className="text-primary text-2xl font-bold">
                          {contacts.data.created_at
                            ? Math.floor((new Date().getTime() - new Date(contacts.data.created_at).getTime()) / (1000 * 60 * 60 * 24))
                            : 0}
                        </div>
                        <div className="text-muted-foreground text-sm">Days in System</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <div className="text-primary text-2xl font-bold">{age || 'N/A'}</div>
                        <div className="text-muted-foreground text-sm">Age (Years)</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <div className="text-primary text-2xl font-bold">{contacts.data.favourite?.length || 0}</div>
                        <div className="text-muted-foreground text-sm">Favorite Foods</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <div className="text-primary text-2xl font-bold">{isDeleted ? 'Deleted' : 'Active'}</div>
                        <div className="text-muted-foreground text-sm">Status</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="personal" className="mt-4 space-y-6">
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="text-primary h-5 w-5" />
                      Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                        <div>
                          <span className="font-medium">Birthday</span>
                          <p className="text-muted-foreground text-sm">Date of birth</p>
                        </div>
                        <div className="text-right">
                          {contacts.data.birthday ? (
                            <>
                              <Badge variant="info" className="gap-1.5">
                                <Cake className="h-3 w-3" />
                                {format(new Date(contacts.data.birthday), 'dd MMM yyyy')}
                              </Badge>
                              <p className="text-muted-foreground mt-1 text-xs">{age} years old</p>
                            </>
                          ) : (
                            <Badge variant="muted">Not set</Badge>
                          )}
                        </div>
                      </div>

                      <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                        <div>
                          <span className="font-medium">Gender</span>
                          <p className="text-muted-foreground text-sm">Biological gender</p>
                        </div>
                        <div className="text-right">{getGenderBadge(contacts.data.gender)}</div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <span className="font-medium">Favorite Foods</span>
                            <p className="text-muted-foreground text-sm">Preferred food items</p>
                          </div>
                          <Badge variant="outline">{contacts.data.favourite?.length || 0} items</Badge>
                        </div>
                        {contacts.data.favourite && contacts.data.favourite.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {contacts.data.favourite.map((item, index) => (
                              <Badge key={index} variant="outline" className="gap-1.5">
                                <Heart className="h-3 w-3 text-rose-500" />
                                {item}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">No favorite foods specified</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="owner" className="mt-4 space-y-6">
                {userInfo ? (
                  <Card className="border-muted">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <UserCheck className="text-primary h-5 w-5" />
                        Contact Owner Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/50 flex items-center gap-4 rounded-lg p-4">
                        <Avatar className="border-border h-12 w-12 border-2">
                          <AvatarImage src={userInfo.avatar || '/placeholder.svg'} alt={userInfo.username} />
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 font-semibold text-white">
                            {getInitials(userInfo.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold">{userInfo.username}</h3>
                            {getUserRoleBadge(userInfo.role)}
                            {getUserStatusBadge(userInfo.status)}
                            {isUserDeleted && <Badge variant="destructive">Deleted</Badge>}
                          </div>
                          <p className="text-muted-foreground mt-1 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {userInfo.email}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={route('users.show', userInfo.id)} className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            View Profile
                          </a>
                        </Button>
                      </div>

                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">User ID:</span>
                          <Badge variant="outline" className="font-mono">
                            #{userInfo.id}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{userInfo.email}</span>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(userInfo.email, 'Email')} className="h-6 w-6 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Role:</span>
                          {getUserRoleBadge(userInfo.role)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Account Status:</span>
                          {getUserStatusBadge(userInfo.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Member Since:</span>
                          <span className="font-medium">
                            {userInfo.created_at ? format(new Date(userInfo.created_at), 'dd MMM yyyy') : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Owner Information</AlertTitle>
                    <AlertDescription>
                      This contact does not have an associated user account or the owner information is not available.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-4 space-y-6">
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="text-primary h-5 w-5" />
                      Timeline & Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Contact Created</p>
                          <p className="text-muted-foreground text-sm">Contact was added to the system</p>
                        </div>
                        <div className="text-right">
                          {contacts.data.created_at ? (
                            <>
                              <Badge variant="info">{formatDistanceToNow(new Date(contacts.data.created_at), { addSuffix: true })}</Badge>
                              <p className="text-muted-foreground mt-1 text-xs">{format(new Date(contacts.data.created_at), "PPP 'at' p")}</p>
                            </>
                          ) : (
                            <Badge variant="muted">Unknown</Badge>
                          )}
                        </div>
                      </div>

                      {contacts.data.updated_at && contacts.data.updated_at !== contacts.data.created_at && (
                        <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <div className="flex-1">
                            <p className="font-medium">Contact Updated</p>
                            <p className="text-muted-foreground text-sm">Contact information was modified</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="warning">{formatDistanceToNow(new Date(contacts.data.updated_at), { addSuffix: true })}</Badge>
                            <p className="text-muted-foreground mt-1 text-xs">{format(new Date(contacts.data.updated_at), "PPP 'at' p")}</p>
                          </div>
                        </div>
                      )}

                      {isDeleted && (
                        <div className="bg-destructive/10 border-destructive/20 flex items-center gap-3 rounded-lg border p-3">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          <div className="flex-1">
                            <p className="text-destructive font-medium">Contact Deleted</p>
                            <p className="text-muted-foreground text-sm">Contact was removed from the system</p>
                          </div>
                          {contacts.data.deleted_at && (
                            <div className="text-right">
                              <Badge variant="destructive">
                                {formatDistanceToNow(new Date(contacts.data.deleted_at), { addSuffix: true })}
                              </Badge>
                              <p className="text-muted-foreground mt-1 text-xs">
                                {format(new Date(contacts.data.deleted_at), "PPP 'at' p")}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Current Status</p>
                          <p className="text-muted-foreground text-sm">Contact is {isDeleted ? 'deleted' : 'active'} in the system</p>
                        </div>
                        <Badge variant={isDeleted ? 'destructive' : 'success'}>{isDeleted ? 'Deleted' : 'Active'}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Tabs>

          <Separator />

          <div className="flex items-center justify-between p-6">
            <Button type="button" variant="outline" onClick={() => router.visit(route('contacts.index'))} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Contacts
            </Button>

            <div className="flex items-center gap-2">
              {isDeleted ? (
                <RestoreModal resourceName="contact" id={contacts.data.id} />
              ) : (
                <>
                  <EditButton endpoint="contact" id={String(contacts.data.id)} />
                  <DeleteModal resourceName="contact" id={contacts.data.id} />
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
