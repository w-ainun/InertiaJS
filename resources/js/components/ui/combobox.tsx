import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/elements/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxOption {
  value: string
  label: string
  description?: string
  avatar?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  editMode?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  disabled = false,
  editMode = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value)
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    setSearchTerm(selectedOption ? selectedOption.label : "");
  }, [value, options]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.avatar && (
                <img
                  src={`${editMode ? '' : '/storage/'}${selectedOption.avatar}`}
                  alt=""
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            value={searchTerm}
            onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label.toString()}
                  onSelect={() => {
                    onValueChange(option.value)
                    setSearchTerm(option.label)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {option.avatar && (
                      <img
                        src={`${editMode ? '' : '/storage/'}${option.avatar}`}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    )}
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      )}
                    </div>
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
