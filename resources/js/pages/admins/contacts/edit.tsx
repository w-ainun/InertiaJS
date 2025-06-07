import type { BreadcrumbItem, Contact, SharedData, User as UserType } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, ChevronLeft, Heart, ImageIcon, Info, LoaderCircle, Phone, Plus, Save, Upload, User, Users, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/elements/button';
import Input from '@/components/elements/input';
import InputError from '@/components/elements/input-error';
import Label from '@/components/elements/label';
import Separator from '@/components/elements/separator';
import Card from '@/components/fragments/card/card';
import CardContent from '@/components/fragments/card/card-content';
import CardDescription from '@/components/fragments/card/card-description';
import CardHeader from '@/components/fragments/card/card-header';
import CardTitle from '@/components/fragments/card/card-title';
import AppLayout from '@/components/layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import DatePicker from '@/components/ui/date-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContactsEdit() {
  const { contacts, users, success, error } = usePage<
    SharedData & {
      contacts: { data: Contact };
      users: UserType[];
    }
  >().props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [favouriteInput, setFavouriteInput] = useState('');

  const { data, setData, post, processing, errors } = useForm({
    user_id: contacts.data.user_id || '',
    name: contacts.data.name || '',
    phone: contacts.data.phone || '',
    profile: null as File | null,
    gender: contacts.data.gender || '',
    birthday: contacts.data.birthday || '',
    favourite: contacts.data.favourite || [],
    _method: 'put',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Contacts',
      href: route('contacts.index'),
    },
    {
      title: 'Edit',
      href: route('contacts.edit', contacts.data.id),
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log(data);
    post(route('contacts.update', contacts.data.id), {
      // forceFormData: true,
      onSuccess: () => {
        toast.success('Contact updated successfully');
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Failed to update contact');

        // Switch to the tab that contains errors
        if (errors.user_id || errors.name || errors.phone) {
          setActiveTab('basic');
        } else if (errors.profile) {
          setActiveTab('profile');
        } else if (errors.gender || errors.birthday || errors.favourite) {
          setActiveTab('personal');
        }
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('profile', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setData('profile', null);
    setImagePreview(null);
  };

  const addFavourite = () => {
    if (favouriteInput.trim() && !data.favourite.includes(favouriteInput.trim())) {
      const newFavourites = [...data.favourite, favouriteInput.trim()];
      console.log('Updating favourite:', newFavourites);
      setData('favourite', newFavourites);
      setFavouriteInput('');
    }
  };

  const removeFavourite = (index: number) => {
    const newFavourites = data.favourite.filter((_, i) => i !== index);
    setData('favourite', newFavourites);
  };

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  useEffect(() => {
    if (contacts.data.profile) {
      setImagePreview(`/storage/${contacts.data.profile}`);
    }
  }, [contacts.data.profile]);

  // Helper function to get initials
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Prepare user options for combobox
  const userOptions = users.map((user) => ({
    value: String(user.id),
    label: user.username,
    description: `${user.email} • ${user.role}`,
    avatar: user.avatar || undefined,
  }));

  // Get selected user info
  const selectedUser = users.find((user) => String(user.id) === String(data.user_id));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container px-4 py-8">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="border-border h-16 w-16 border-4">
                <AvatarImage
                  src={imagePreview || (contacts.data.profile ? `/storage/${contacts.data.profile}` : '/placeholder.svg')}
                  alt={contacts.data.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
                  {getInitials(contacts.data.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">Edit Contact</CardTitle>
                  <Badge variant={contacts.data.gender === 'MAN' ? 'info' : 'purple'}>{contacts.data.gender === 'MAN' ? 'Male' : 'Female'}</Badge>
                </div>
                <CardDescription className="mt-1 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Update contact information for {contacts.data.name}
                </CardDescription>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    ID: #{contacts.data.id}
                  </Badge>
                  {selectedUser && <Badge variant="outline">Owner: {selectedUser.username}</Badge>}
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Contact Info Summary */}
          <div className="bg-muted/20 border-b px-6 py-4">
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-mono font-medium">{contacts.data.phone}</span>
              </div>
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
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Basic Info</span>
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Personal</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6">
                <TabsContent value="basic" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200"
                  >
                    <Info className="h-4 w-4" />
                    <AlertTitle>Basic Information</AlertTitle>
                    <AlertDescription>Update the contact's basic information including the associated user, name, and phone number.</AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="user_id" className="flex items-center font-medium">
                        <Users className="text-muted-foreground mr-2 h-4 w-4" />
                        Associated User <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Combobox
                        options={userOptions}
                        value={String(data.user_id)}
                        onValueChange={(value) => setData('user_id', Number(value))}
                        placeholder="Search and select a user..."
                        searchPlaceholder="Search users..."
                        emptyText="No users found."
                        className="max-w-md"
                      />
                      {errors.user_id && <InputError id="user_id-error" message={errors.user_id} />}
                      <p className="text-muted-foreground text-xs">Select the user who owns this contact</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center font-medium">
                          <User className="text-muted-foreground mr-2 h-4 w-4" />
                          Full Name <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter full name"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          aria-invalid={errors.name ? 'true' : 'false'}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className="max-w-md"
                          required
                        />
                        {errors.name && <InputError id="name-error" message={errors.name} />}
                        <p className="text-muted-foreground text-xs">Enter the contact's full name</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center font-medium">
                          <Phone className="text-muted-foreground mr-2 h-4 w-4" />
                          Phone Number <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="08123456789"
                          value={data.phone}
                          onChange={(e) => setData('phone', e.target.value)}
                          aria-invalid={errors.phone ? 'true' : 'false'}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                          className="max-w-md font-mono"
                          required
                        />
                        {errors.phone && <InputError id="phone-error" message={errors.phone} />}
                        <p className="text-muted-foreground text-xs">Enter phone number (Indonesian format recommended)</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-200"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <AlertTitle>Profile Picture</AlertTitle>
                    <AlertDescription>
                      Upload a profile picture for this contact. Supported formats: JPEG, PNG, JPG, GIF. Max size: 5MB.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="flex items-center font-medium">
                        <ImageIcon className="text-muted-foreground mr-2 h-4 w-4" />
                        Profile Picture
                      </Label>

                      <div className="flex items-start gap-6">
                        <div className="flex flex-col items-center gap-4">
                          <Avatar className="border-border h-24 w-24 border-4">
                            <AvatarImage
                              src={imagePreview || (contacts.data.profile ? `/storage/${contacts.data.profile}` : '/placeholder.svg')}
                              alt={data.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-semibold text-white">
                              {getInitials(data.name)}
                            </AvatarFallback>
                          </Avatar>
                          {imagePreview && (
                            <Button type="button" variant="outline" size="sm" onClick={removeImage} className="flex items-center gap-1">
                              <X className="h-3 w-3" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-6 text-center">
                            <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                            <div className="space-y-2">
                              <Label htmlFor="profile" className="cursor-pointer">
                                <span className="text-primary hover:text-primary/80 text-sm font-medium">Click to upload</span>
                                <span className="text-muted-foreground text-sm"> or drag and drop</span>
                              </Label>
                              <Input id="profile" name="profile" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                              <p className="text-muted-foreground text-xs">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          </div>
                          {errors.profile && <InputError message={errors.profile} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="personal" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
                  >
                    <Heart className="h-4 w-4" />
                    <AlertTitle>Personal Information</AlertTitle>
                    <AlertDescription>
                      Add personal details like gender, birthday, and favorite foods to make the contact more complete.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <Label className="flex items-center font-medium">
                        <User className="text-muted-foreground mr-2 h-4 w-4" />
                        Gender <span className="text-destructive ml-1">*</span>
                      </Label>
                      <RadioGroup value={data.gender} onValueChange={(value) => setData('gender', value as 'MAN' | 'WOMAN')} className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="MAN" id="MAN" />
                          <Label htmlFor="MAN" className="cursor-pointer">
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="WOMAN" id="WOMAN" />
                          <Label htmlFor="WOMAN" className="cursor-pointer">
                            Female
                          </Label>
                        </div>
                      </RadioGroup>
                      {errors.gender && <InputError message={errors.gender} />}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center font-medium">
                        <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                        Birthday
                      </Label>
                      <DatePicker date={data.birthday ? new Date(data.birthday) : undefined} setDate={(date) => setData('birthday', date!)} />
                      {errors.birthday && <InputError message={errors.birthday} />}
                      <p className="text-muted-foreground text-xs">Select the contact's birth date</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="flex items-center font-medium">
                      <Heart className="text-muted-foreground mr-2 h-4 w-4" />
                      Favorite Foods
                    </Label>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a favorite food..."
                        value={favouriteInput}
                        onChange={(e) => setFavouriteInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFavourite();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addFavourite} disabled={!favouriteInput.trim()} className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>

                    {data.favourite.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">Current favorites:</p>
                        <div className="flex flex-wrap gap-2">
                          {data.favourite.map((item, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {item}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFavourite(index)}
                                className="ml-1 h-auto p-0 hover:bg-transparent"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.favourite && <InputError message={errors.favourite} />}
                    <p className="text-muted-foreground text-xs">Add favorite foods one by one. Press Enter or click Add to include each item.</p>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>

            <Separator />

            <div className="flex items-center justify-between p-6">
              <Button type="button" variant="outline" onClick={() => router.visit(route('contacts.index'))} className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Contacts
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setData({
                      user_id: contacts.data.user_id || '',
                      name: contacts.data.name || '',
                      phone: contacts.data.phone || '',
                      profile: null,
                      gender: contacts.data.gender || 'MAN',
                      birthday: contacts.data.birthday || '',
                      favourite: contacts.data.favourite || [],
                      _method: 'PUT',
                    });
                    setImagePreview(contacts.data.profile ? `/storage/${contacts.data.profile}` : null);
                  }}
                  disabled={processing || isSubmitting}
                >
                  Reset Changes
                </Button>

                <Button type="submit" disabled={processing || isSubmitting} className="min-w-[140px]">
                  {processing || isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Contact
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
