import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
}

export interface DiscoverLink extends NavLink {
  icon: LucideIcon;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}
