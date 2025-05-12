import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Head, useForm } from '@inertiajs/react';

import Input from '@/components/elements/input';
import Label from '@/components/elements/label';
import { Button } from '@/components/elements/button';
import InputError from '@/components/elements/input-error';
import AuthTemplate from '@/components/templates/auth-template';

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } =
  useForm<Required<{ password: string }>>({
    password: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.confirm'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthTemplate
      title="Confirm your password"
      description="This is a secure area of the application. Please confirm your password before continuing."
    >
      <Head title="Confirm password" />

      <form onSubmit={submit}>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password"
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={data.password}
                autoFocus
                onChange={(e) => setData('password', e.target.value)}
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center">
            <Button className="w-full" disabled={processing}>
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Confirm password
            </Button>
          </div>
        </div>
      </form>
    </AuthTemplate>
  );
};