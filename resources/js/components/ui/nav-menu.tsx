import { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';

interface NavMenuProps {
  type?: 'link' | 'dropdown';
  title: string;
  href?: string;
  items?: NavItem[];
}

export function NavMenu({ type = 'link', title, href = '#', items }: NavMenuProps) {
  if (type === 'dropdown') {
    return (
      <NavigationMenu>  
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-[200px] gap-3">
                {items?.map((item) => (
                  <li key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link href={item.href || '#'}>{item.title}</Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link href={href || '#'} className="cursor-pointer">
              {title}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}