import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Head, useForm } from '@inertiajs/react';

import Input from '@/components/elements/input';
import Label from '@/components/elements/label';
import { Button } from '@/components/elements/button';
import Checkbox from '@/components/elements/checkbox';
import TextLink from '@/components/elements/text-link';
import InputError from '@/components/elements/input-error';
import AuthTemplate from '@/components/templates/auth-template';

type LoginForm = {
  email: string;
  username: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } =
  useForm<Required<LoginForm>>({
    email: '',
    username: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthTemplate
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <Head title="Sign In" />

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
              autoComplete="username"
            />
            <InputError message={errors.username} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {canResetPassword && (
                <TextLink href={route('password.request')}
                  className="ml-auto text-sm"
                  tabIndex={6}
                >
                  Forgot password?
                </TextLink>
              )}
            </div>
            <Input id="password"
              type="password"
              placeholder="Password"
              required
              tabIndex={3}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              autoComplete="current-password"
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox id="remember"
              checked={data.remember}
              onClick={() => setData('remember', !data.remember)}
              tabIndex={4}
              name="remember"
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button type="submit" className="mt-4 w-full" tabIndex={5} disabled={processing}>
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Log in
          </Button>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          Don't have an account?{' '}
          <TextLink href={route('register')} tabIndex={7}>
            Sign up
          </TextLink>
        </div>
      </form>

      {status &&
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          { status }
        </div>}
    </AuthTemplate>
  );
};