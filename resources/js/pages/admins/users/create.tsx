import { Button } from '@/components/elements/button';
import InputError from '@/components/elements/input-error';
import Label from '@/components/elements/label';
import FormFieldInput from '@/components/fragments/form/form-field-input';
import AppLayout from '@/components/layouts/app-layout';
import FormSimpleLayout from '@/components/layouts/form-layout';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: route('users.index'),
  },
  {
    title: 'Create',
    href: route('users.create'),
  },
];

export default function UsersCreate() {
  const { success, error } = usePage<SharedData>().props;

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    role: '',
    status: 'active',
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    post(route('users.store'), {
      onFinish: () => reset('password', 'password_confirmation', 'role'),
      onError: (e) => console.log(e),
    });
  };

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <FormSimpleLayout onSubmit={handleSubmit}>
            <FormFieldInput
              htmlFor="username"
              label="Username"
              type="text"
              id="username"
              name="username"
              placeholder="rhindottire"
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              message={errors.username || ''}
            />
            <FormFieldInput
              htmlFor="email"
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="achmadaliridho46@gmail.com"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              message={errors.email || ''}
            />
            <FormFieldInput
              htmlFor="password"
              label="Password"
              type="password"
              id="password"
              name="password"
              placeholder="********"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              message={errors.password || ''}
            />
            <FormFieldInput
              htmlFor="password_confirmation"
              label="Confirm Password"
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              placeholder="********"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              message={errors.password_confirmation || ''}
            />
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Role</Label>
              <Select
                value={data.role}
                onValueChange={(value) => setData('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="COURIER">Courier</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <InputError message={errors.role} />
            </div>
            <Button
              type="submit"
              className="mt-4 w-full"
              tabIndex={4}
              disabled={processing}
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Create
            </Button>
          </FormSimpleLayout>
          {/* <BorderBeam size={300} duration={10} /> */}
        </div>
      </div>
    </AppLayout>
  );
}