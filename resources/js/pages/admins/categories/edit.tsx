import { Button } from '@/components/elements/button';
import Input from '@/components/elements/input';
import InputError from '@/components/elements/input-error';
import Label from '@/components/elements/label';
import CardContent from '@/components/fragments/card/card-content';
import AppLayout from '@/components/layouts/app-layout';
import { ImagePreviewInput } from '@/components/ui/form-field-file';
import FormFieldTextarea from '@/components/ui/form-field-textarea';
import { BreadcrumbItem, Category, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ChartBar, ChevronLeft, File, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Categories',
    href: route('categories.index'),
  },
  {
    title: 'Create',
    href: route('categories.create'),
  },
];

export default function UsersCreate() {
  const { category, success, error } = usePage<
    SharedData & {
      category: { data: Category };
    }
  >().props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: category.data.name,
    image_url: category.data.image_url as File | string | null,
    description: category.data.description,
  });

  console.log(category.data);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    post(route('categories.store'), {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Category created successfully');
        reset('name', 'image_url', 'description');
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Failed to create category');
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
      <Head title="Create User" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label htmlFor="Product Category" className="flex items-center font-medium">
                  <ChartBar className="text-muted-foreground mr-2 h-4 w-4" />
                  Product Category <span className="text-destructive ml-1">*</span>
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
                  className="w-full"
                  required
                />
                {errors.name && <InputError id="name-error" message={errors.name} />}
              </div>

              <ImagePreviewInput
                className="mt-4 space-y-2"
                htmlFor="image_url"
                label="Category Image"
                currentImageUrl={data.image_url ? `${data.image_url}` : undefined}
                onChange={(file) => {
                  setData('image_url', file as File);
                }}
                error={errors.image_url}
              />

              <FormFieldTextarea
                className="mt-4 space-y-2"
                htmlFor="description"
                label="Description"
                value={data.description}
                setValue={(value) => setData('description', value)}
                message={errors.description || ''}
              />

              <div className="flex items-center justify-between p-6">
                <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back to Contacts
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      reset('name');
                      setData('image_url',  null);
                      // setFavouriteInput('');
                    }}
                    disabled={processing || isSubmitting}
                  >
                    Reset Form
                  </Button>

                  <Button type="submit" disabled={processing || isSubmitting} className="min-w-[140px]">
                    {processing || isSubmitting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <File className="mr-2 h-4 w-4" />
                        Create Category
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
