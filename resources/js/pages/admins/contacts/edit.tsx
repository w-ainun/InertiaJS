import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem, Contact, SharedData, User } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Calendar, ChevronLeft, LoaderCircle, Phone, UserIcon, UserPlus } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/elements/button';
import Input from '@/components/elements/input';
import InputError from '@/components/elements/input-error';
import Label from '@/components/elements/label';
import Separator from '@/components/elements/separator';
import AppLayout from '@/components/layouts/app-layout';
import DatePicker from '@/components/ui/date-picker';

export default function ContactsEdit() {
  const { contacts, users, success, error } = usePage<
    SharedData & {
      contacts: { data: Contact };
      users: User[];
    }
  >().props;
  console.log(contacts);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    user_id: contacts.data.user_id,
    name: contacts.data.name,
    phone: contacts.data.phone,
    // profile: contacts.data.profile,
    profile: null as File | string | null,
    gender: contacts.data.gender,
    birthday: contacts.data.birthday,
    favourite: contacts.data.favourite || [] as string[],
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

    put(route('contacts.update', contacts.data.id), {
      // forceFormData: true,
      onSuccess: () => {
        toast.success('Contact created successfully');
        reset('user_id', 'name', 'phone', 'profile', 'gender', 'birthday', 'favourite');
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Failed to create contact');
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container px-4 py-8">
        <div className="rounded-lg border shadow-sm">
          <div className="flex items-center gap-3 border-b px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Edit Contact</h1>
              <p className="text-sm">Edit the contact with complete information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Contact Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_id" className="text-sm font-medium">
                    Select User <span className="text-red-500">*</span>
                  </Label>
                  <Select value={String(data.user_id)} onValueChange={(value) => setData('user_id', Number(value))} name="user_id" required>
                    <SelectTrigger id="user_id" aria-invalid={errors.user_id ? 'true' : 'false'} className="w-full focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Choose a user from the list" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Users</SelectLabel>
                        {users.map((user) => (
                          <SelectItem value={String(user.id)} key={user.id}>
                            {user.username}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.user_id && <InputError id="user_id-error" message={errors.user_id} />}
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Contact Details</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter full name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className="focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.name && <InputError id="name-error" message={errors.name} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      aria-invalid={errors.phone ? 'true' : 'false'}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      className="focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.phone && <InputError id="phone-error" message={errors.phone} />}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Personal Information</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <RadioGroup
                    value={data.gender}
                    onValueChange={(value) => {
                      if (value === 'MAN' || value === 'WOMAN') {
                        setData('gender', value);
                      }
                    }}
                  >
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MAN" id="MAN" />
                      <Label htmlFor="MAN">MAN</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="WOMAN" id="WOMAN" />
                      <Label htmlFor="WOMAN">WOMAN</Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label htmlFor='birthday'>
                      Birthday
                    </Label>
                    <DatePicker
                      date={data.birthday ? new Date(data.birthday) : undefined}
                      setDate={(date) => setData('birthday', date!)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile" className="text-sm font-medium">
                    Upload Profile Picture
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="profile"
                      name="profile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setData('profile', file);
                        }
                      }}
                      aria-invalid={errors.profile ? 'true' : 'false'}
                      aria-describedby={errors.profile ? 'profile-error' : undefined}
                      className="w-full focus:ring-2 focus:ring-blue-500"
                    />
                    {data.profile && typeof data.profile !== 'string' && (
                      <span className="text-sm font-medium text-green-600">✓ {data.profile.name}</span>
                    )}
                  </div>
                  {errors.profile && <InputError id="profile-error" message={errors.profile} />}
                  <p className="text-xs">Supported formats: JPEG, PNG, JPG, GIF. Max size: 5MB</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favourite" className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      Favorite
                    </div>
                  </Label>
                  <Input
                    id="favourite"
                    name="favourite"
                    placeholder="e.g., Music, Sports, Reading, Cooking..."
                    value={
                      Array.isArray(data.favourite)
                        ? data.favourite.join(', ')
                        : JSON.parse(data.favourite || '[]').join(', ')
                    }
                    onChange={(e) => {
                      const values = e.target.value
                        .split(',')
                        .map((v) => v.trim())
                        .filter((v) => v.length > 0);
                      setData('favourite', values);
                    }}
                    aria-invalid={errors.favourite ? 'true' : 'false'}
                    aria-describedby={errors.favourite ? 'favourite-error' : undefined}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.favourite && <InputError id="favourite-error" message={errors.favourite} />}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit(route('contacts.index'))}
                  className="flex items-center gap-2 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Contacts
                </Button>

                <Button type="submit" disabled={processing || isSubmitting}>
                  {processing || isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Update Contact
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
