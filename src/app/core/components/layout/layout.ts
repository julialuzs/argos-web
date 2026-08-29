import { Component, signal, OnInit, inject, computed, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { SignOut } from '@primeicons/angular/sign-out';
import { UsuarioLogado } from '@shared/services/usuario';
import { DividerModule } from 'primeng/divider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AuthService } from '@core/services/auth.service';
import { TemaService } from '@core/services/tema.service';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ProjetoService } from '@features/projetos/projeto.service';
import { Projeto } from '@shared/models/projeto';
import { PrimeiraLetraPipe } from '@shared/pipes/primeira-letra-pipe';

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
  ToggleSwitchModule,
  MenuModule,
  TooltipModule,
];

const icons = [SignOut];

type HeaderNavItem = {
  icon: string;
  label: string;
  routerLink: string | null;
  disabled: boolean;
  disabledTooltip?: string;
  isActive: () => boolean;
};

interface NavItem {
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  subItems?: { label: string; isActive?: boolean }[];
}

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLinkWithHref,
    FormsModule,
    PrimeiraLetraPipe,
    ...primeNgModules,
    ...icons,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  usuarioService = inject(UsuarioService);
  authService = inject(AuthService);
  projetoSelecionadoService = inject(ProjetoSelecionadoService);
  projetoService = inject(ProjetoService);
  temaService = inject(TemaService);
  messageService = inject(MessageService);
  router = inject(Router);

  readonly projetoSelecionado = this.projetoSelecionadoService.projetoSelecionado;
  menuProjeto = viewChild<Menu>('menuProjeto');
  projetos = signal<Projeto[]>([]);

  open = signal(true);
  isMobile = signal(false);
  usuarioLogado = signal<UsuarioLogado | null>(null);

  items = computed<HeaderNavItem[]>(() => {
    const projeto = this.projetoSelecionado();
    const semProjeto = projeto === null;

    return [
      {
        label: 'Projetos',
        icon: 'home',
        routerLink: '/projetos',
        disabled: false,
        isActive: () => this.router.url.includes('/projetos'),
      },
      {
        label: 'Relatórios',
        icon: 'receipt',
        routerLink: projeto ? `/${projeto.id}/relatorios` : null,
        disabled: semProjeto,
        disabledTooltip: 'Selecione um projeto para continuar',
        isActive: () => this.router.url.includes('/relatorios'),
      },
      {
        label: 'Dashboard',
        icon: 'chart-bar',
        routerLink: projeto ? `/${projeto.id}/dashboard` : null,
        disabled: semProjeto,
        disabledTooltip: 'Selecione um projeto para continuar',
        isActive: () => this.router.url.includes('/dashboard'),
      },
      {
        label: 'Como configurar o Argos?',
        icon: 'book',
        routerLink: '/tutorial',
        disabled: false,
        isActive: () => this.router.url.includes('/tutorial'),
      },
    ];
  });

  itensMenuProjeto = computed<MenuItem[]>(() => {
    const selecionadoId = this.projetoSelecionado()?.id;
    const itens: MenuItem[] = this.projetos().map((projeto) => ({
      label: projeto.nome,
      icon: projeto.id === selecionadoId ? 'pi pi-check' : 'pi pi-folder',
      command: () => this.selecionarProjetoDoMenu(projeto),
    }));

    if (itens.length === 0) {
      itens.push({ label: 'Nenhum projeto cadastrado', disabled: true });
    }

    itens.push(
      { separator: true },
      {
        label: 'Gerenciar projetos',
        icon: 'pi pi-th-large',
        command: () => this.router.navigate(['/projetos']),
      },
    );

    return itens;
  });

  ngOnInit(): void {
    this.usuarioService.getUsuarioLogado().subscribe((usuario) => {
      this.usuarioLogado.set(usuario);
    });
    this.carregarProjetos();
  }

  abrirMenuProjeto(event: Event) {
    this.carregarProjetos();
    this.menuProjeto()?.toggle(event);
  }

  rotuloSeletorProjeto(): string {
    const projeto = this.projetoSelecionado();
    return projeto
      ? `Projeto atual: ${projeto.nome}. Clique para trocar.`
      : 'Selecione um projeto';
  }

  onNavClick(event: Event, item: HeaderNavItem) {
    if (!item.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.messageService.add({
      severity: 'info',
      summary: 'Selecione um projeto',
      detail: 'Escolha um projeto para visualizar relatórios e o dashboard.',
    });
    this.router.navigate(['/projetos']);
  }

  hasActiveSub(item: NavItem): boolean {
    return !!item.subItems?.some((s) => s.isActive);
  }

  logout() {
    this.projetoSelecionadoService.limpar();
    this.authService.logout();
    this.router.navigate(['login']);
  }

  private carregarProjetos() {
    this.projetoService.listarProjetosPorUsuarioLogado().subscribe({
      next: (projetos) => this.projetos.set(projetos),
    });
  }

  private selecionarProjetoDoMenu(projeto: Projeto) {
    this.projetoSelecionadoService.selecionar(projeto);
    const url = this.router.url;
    if (url.includes('/relatorios')) {
      this.router.navigate([projeto.id, 'relatorios']);
      return;
    }
    if (url.includes('/dashboard')) {
      this.router.navigate([projeto.id, 'dashboard']);
    }
  }
}
