import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Head, useForm } from '@inertiajs/react';

import Input from '@/components/elements/input';
import Label from '@/components/elements/label';
import { Button } from '@/components/elements/button';
import TextLink from '@/components/elements/text-link';
import InputError from '@/components/elements/input-error';
import AuthTemplate from '@/components/templates/auth-template';

type RegisterForm = {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
};

export default function Register() {
  const { data, setData, post, processing, errors, reset } =
  useForm<Required<RegisterForm>>({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
      onError: (e) => console.log(e)
    });
  };

  return (
    <AuthTemplate
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <Head title="Sign Up" />
      <form className="flex flex-col gap-6" onSubmit={submit}>
        <div className="grid gap-6">

          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email"
              type="email"
              placeholder="email@example.com"
              autoFocus
              required
              tabIndex={1}
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              disabled={processing}
              autoComplete="email"
            />
            <InputError message={errors.email} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username"
              type="text"
              placeholder="Username"
              required
              tabIndex={2}
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              disabled={processing}
              autoComplete="username"
            />
            <InputError message={errors.username} className="mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password"
                type="password"
                placeholder="Password"
                required
                tabIndex={3}
                disabled={processing}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                autoComplete="new-password"
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm password</Label>
              <Input id="password_confirmation"
                type="password"
                placeholder="Confirm password"
                required
                tabIndex={4}
                disabled={processing}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                autoComplete="new-password"
              />
              <InputError message={errors.password_confirmation} />
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Create account
          </Button>
        </div>

        <div className="text-muted-foreground text-center text-sm">
            Already have an account?{' '}
            <TextLink href={route('login')} tabIndex={6}>
                Log in
            </TextLink>
        </div>
      </form>
    </AuthTemplate>
  );
};