import { type User } from '@/types';
import { useInitials } from '@/hooks/use-initials';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserInfo({
  user,
  showEmail = false
}: { user: User; showEmail?: boolean }) {
  const getInitials = useInitials();

  return (
    <>
      <Avatar className="h-8 w-8 overflow-hidden rounded-full">
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
          {getInitials(user.username!)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.username}</span>
        {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
      </div>
    </>
  );
};