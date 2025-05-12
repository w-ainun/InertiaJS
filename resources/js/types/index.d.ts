import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  href: string;
  title: string;
}

export interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
  isActive?: boolean;
  icon?: LucideIcon | null;
}

export interface SharedData {
  auth: Auth;
  name: string;
  [key: string]: unknown;
  ziggy: Config & { location: string };
  quote: { message: string; author: string };
}

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  role: string;
  status: string;
  deleted_at: Date | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}