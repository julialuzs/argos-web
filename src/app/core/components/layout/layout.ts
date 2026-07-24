import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
// import { Receipt, Search, ChartBar } from '@primeicons/angular';
import { PIcon } from '@primeicons/angular/p-icon';

const primeNgModules = [
  SidebarModule,
  AvatarModule,
  BadgeModule,
  MenubarModule,
  InputTextModule,
  RippleModule,
  PIcon,
];

// const icons = [Receipt, Search, ChartBar];

interface NavItem {
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  subItems?: { label: string; isActive?: boolean }[];
}
interface NavGroup {
  label: string;
  action?: boolean;
  items: NavItem[];
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, ...primeNgModules, RouterLinkWithHref],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  isMobile = signal(false);
  open = signal(true);

  items = [
    {
      label: 'Home',
      icon: 'home',
    },
    {
      label: 'Projetos',
      icon: 'search',
      badge: '3', // apenas exemplo, mudar depois pra ser programático
      routerLink: '/projetos',
      items: [
        {
          label: 'Core',
          icon: 'bolt',
          shortcut: '⌘+S',
        },
        {
          label: 'Blocks',
          icon: 'server',
          shortcut: '⌘+B',
        },
        {
          separator: true,
        },
        {
          label: 'UI Kit',
          icon: 'pencil',
          shortcut: '⌘+U',
        },
      ],
    },
    {
      label: 'Relatórios',
      icon: 'receipt',
      routerLink: '/relatorios',
    },
    {
      label: 'Dashboard',
      icon: 'chart-bar',
      routerLink: '/dashboard',
    },
  ];

  navGroups: NavGroup[] = [
    {
      label: 'Navigation',
      items: [
        { icon: 'home', label: 'Home', isActive: true },
        { icon: 'inbox', label: 'Análises' },
        { icon: 'search', label: 'Dashboard' },
        { icon: 'bell', label: 'Notifications' },
      ],
    },
  ];

  hasActiveSub(item: NavItem): boolean {
    return !!item.subItems?.some((s) => s.isActive);
  }
}
