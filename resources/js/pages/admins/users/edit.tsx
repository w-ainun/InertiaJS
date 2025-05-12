import { toast } from "sonner";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { BreadcrumbItem, SharedData, User } from "@/types";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Label from "@/components/elements/label";
import { Button } from "@/components/elements/button";
import AppLayout from "@/components/layouts/app-layout";
import InputError from "@/components/elements/input-error";
import FormSimpleLayout from "@/components/layouts/form-layout";
import FormFieldInput from "@/components/fragments/form/form-field-input";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: route('users.index'),
  },
  {
    title: 'Edit',
    href: '/users/edit',
  },
];

export default function UsersEdit() {
  const { user, success, error } = usePage<
    SharedData & { user: { data: User } }
  >().props;

  const { data, setData, put, processing, errors } = useForm({
    email: user.data.email,
    username: user.data.username,
    password: '',
    role: user.data.role,
    status: user.data.status,
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    put(route('users.update', user.data.id), {
      onError: (e) => console.log(e),
    });
  };

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit User" />
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
              Save
            </Button>
          </FormSimpleLayout>
          {/* <BorderBeam size={300} duration={10} /> */}
        </div>
      </div>
    </AppLayout>
  );
}