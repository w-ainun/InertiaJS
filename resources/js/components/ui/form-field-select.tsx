import InputError from '@/components/elements/input-error';
import { Button } from '@/components/elements/button';
import Label from '@/components/elements/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import Card from '../fragments/card/card';
import CardHeader from '../fragments/card/card-header';
import CardTitle from '../fragments/card/card-title';
import CardContent from '../fragments/card/card-content';

interface FormFieldSelectProps<TData> {
  data: TData[];
  label?: string;
  placeholder?: string;
  value: string | number;
  displayValue?: string; // Optional: custom display string
  onChange: (value: string | number, item: TData) => void;
  getOptionLabel: (item: TData) => string;
  getOptionValue: (item: TData) => string | number;
  message?: string;
}

export default function FormFieldSelect<TData>({
  data,
  label = 'Select',
  placeholder = 'Select option...',
  value,
  displayValue,
  onChange,
  getOptionLabel,
  getOptionValue,
  message,
}: FormFieldSelectProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Card className="grid gap-2">
      <CardHeader>
        <CardTitle className="text-xl">
          {label && <Label className="text-xl">{label}</Label>}
        </CardTitle>
      </CardHeader>
      <Popover open={open} onOpenChange={setOpen}>
        <CardContent>
          <PopoverTrigger asChild className="w-full">
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {displayValue || placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
        </CardContent>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              defaultValue={displayValue}
              placeholder={`Search ${label.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {data.map((item) => {
                  const itemValue = getOptionValue(item);
                  const labelText = getOptionLabel(item);
                  return (
                    <CommandItem
                      key={itemValue}
                      value={labelText}
                      onSelect={() => {
                        onChange(itemValue, item);
                        setOpen(false);
                      }}
                    >
                      {labelText}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          itemValue === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {message && <InputError message={message} />}
    </Card>
  );
}