import InputError from '@/components/elements/input-error';
import Label from '@/components/elements/label';
import { cn } from '@/lib/utils';
import { EditIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '../fragments/card/card';
import CardHeader from '../fragments/card/card-header';
import CardTitle from '../fragments/card/card-title';
import { Button } from '../elements/button';
import CardDescription from '../fragments/card/card-description';
import { Textarea } from './textarea';

type FormFieldPropsInput = {
  htmlFor: string;
  label: string;
  message: string;
  className?: string;
  value: string;
  setValue: (value: string) => void;
  onFilled?: () => void;
} & React.ComponentProps<'textarea'>;

export default function FormFieldTextarea({
  htmlFor,
  label,
  message,
  className,
  value,
  setValue,
  onFilled,
  ...props
}: FormFieldPropsInput) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(value);
  const [wasEmpty, setWasEmpty] = useState(value.trim() === '');

  useEffect(() => {
    if (editMode) {
      setInputValue(value);
      setWasEmpty(value.trim() === '');
    }
  }, [editMode, value]);

  const handleSave = () => {
    setEditMode(false);
    setValue(inputValue);
    if (wasEmpty && inputValue.trim() !== '') {
      onFilled?.();
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setInputValue(value);
  };

  return (
    <Card className={cn('grid gap-2', message && 'border-red-500', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Label htmlFor={htmlFor} className="text-xl">
            {label}
          </Label>
          {editMode ? (
            <Button
              type="button"
              onClick={handleCancel}
              className="cursor-pointer"
              size="sm"
              variant="link"
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setEditMode(true)}
              className="cursor-pointer"
              size="sm"
              variant="link"
            >
              <EditIcon className="h-4 w-4" />
              Edit {label}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          {editMode ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                {...props}
              >
                {value}
              </Textarea>
              <InputError message={message} />
              <Button
                type="button"
                onClick={handleSave}
                className="w-16 cursor-pointer"
                size="sm"
              >
                Save
              </Button>
            </div>
          ) : (
            <p>{value || `No ${label}`}</p>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
