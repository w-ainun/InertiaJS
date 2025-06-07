import { useIsMobile } from '@/hooks/use-mobile';
import { Contact, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { RootNavMain } from './root-nav-main';
import Input from '../elements/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './command';

export function RootNav() {
  const { contacts } = usePage<SharedData>().props;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value.length > 0) {
      setOpen(true);
    }
  };

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-popover-content]')
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure the popover is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [open]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowDown' && open) {
      e.preventDefault();
      // Focus the first command item
      const firstItem = document.querySelector('[cmdk-item]') as HTMLElement;
      firstItem?.focus();
    }
  };

  // Filter courses based on search
  // const filteredContacts =
  //   contacts.data.filter((contact: Contact) =>
  //     contact.user.toLowerCase().includes(search.toLowerCase()),
  //   ) || [];

  const filteredContacts =
  (contacts?.data as Contact[]).filter((contact: Contact) =>
    contact.user.username.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <Fragment>
      {!isMobile && (
        <>
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={search}
              onChange={handleInputChange}
              onFocus={() => search.length > 0 && setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search User Data on List"
              className="w-[300px] rounded-md border px-4 py-2"
            />

            {open && filteredContacts.length > 0 && (
              <div
                className="bg-popover absolute top-full left-0 z-50 mt-1 w-[300px] rounded-md border shadow-md"
                data-popover-content
              >
                <Command className="rounded-lg border shadow-md">
                  <CommandList>
                    {filteredContacts.length === 0 ? (
                      <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {filteredContacts.map((contact) => (
                          <CommandItem
                            key={contact.id}
                            value={contact.name}
                            onSelect={() => {
                              // Handle selection
                              setSearch(contact.name);
                              setOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Link href={`/academies/${contact.id}`}>
                              {contact.name}
                            </Link>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
          <RootNavMain />
        </>
      )}
    </Fragment>
  );
}