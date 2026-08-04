import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { PIcon } from '@primeicons/angular/p-icon';
import { ProjetoSelecionadoService } from '@core/services/projeto-selecionado.service';
import { UsuarioService } from '@shared/services/usuario.service';
import { ButtonModule } from 'primeng/button';
import { Cog } from '@primeicons/angular/cog';
import { Plus } from '@primeicons/angular/plus';
import { UsuarioLogado } from '@shared/services/usuario';
import { DividerModule } from 'primeng/divider';

const primeNgModules = [
  SidebarModule,
  AvatarModule,
  BadgeModule,
  MenubarModule,
  InputTextModule,
  RippleModule,
  PIcon,
  ButtonModule,
  DividerModule,
];

const icons = [Cog, Plus];

interface NavItem {
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  subItems?: { label: string; isActive?: boolean }[];
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLinkWithHref, ...primeNgModules, ...icons],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  usuarioService = inject(UsuarioService);
  projetoSelecionadoService = inject(ProjetoSelecionadoService);
  router = inject(Router);

  open = signal(true);
  isMobile = signal(false);
  usuarioLogado = signal<UsuarioLogado | null>(null);

  items = computed(() => {
    return [
      {
        label: 'Projetos',
        icon: 'home',
        routerLink: '/projetos',
      },
      {
        label: 'Relatórios',
        icon: 'receipt',
        routerLink: `${this.projetoSelecionadoService.projetoSelecionado()?.id}/relatorios`,
        disabled: this.projetoSelecionadoService.projetoSelecionado() === null,
      },
      {
        label: 'Dashboard',
        icon: 'chart-bar',
        routerLink: `${this.projetoSelecionadoService.projetoSelecionado()?.id}/dashboard`,
        disabled: this.projetoSelecionadoService.projetoSelecionado() === null,
      },
    ];
  });

  ngOnInit(): void {
    this.usuarioService.getUsuarioLogado().subscribe((usuario) => {
      this.usuarioLogado.set(usuario);
    });
  }

  selecionarProjeto() {
    this.router.navigate(['projetos']);
  }

  hasActiveSub(item: NavItem): boolean {
    return !!item.subItems?.some((s) => s.isActive);
  }
}
