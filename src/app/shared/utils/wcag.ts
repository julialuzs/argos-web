const BASE_WCAG_PT_BR = 'https://www.w3.org/Translations/WCAG22-pt-BR/';

const AXE_SC_TAG = /^wcag(\d)(\d)(\d+)$/i;
const FORMATTED_SC = /^(\d+)\.(\d+)\.(\d+)$/;
const CRITERIOS_OBSOLETOS = new Set(['4.1.1']);

/** Fragments oficiais da tradução WCAG 2.2 em português. */
const SLUGS_WCAG: Record<string, string> = {
  '1.1.1': 'non-text-content',
  '1.2.1': 'audio-only-and-video-only-prerecorded',
  '1.2.2': 'captions-prerecorded',
  '1.2.3': 'audio-description-or-media-alternative-prerecorded',
  '1.2.4': 'captions-live',
  '1.2.5': 'audio-description-prerecorded',
  '1.2.6': 'sign-language-prerecorded',
  '1.2.7': 'extended-audio-description-prerecorded',
  '1.2.8': 'media-alternative-prerecorded',
  '1.2.9': 'audio-only-live',
  '1.3.1': 'info-and-relationships',
  '1.3.2': 'meaningful-sequence',
  '1.3.3': 'sensory-characteristics',
  '1.3.4': 'orientation',
  '1.3.5': 'identify-input-purpose',
  '1.3.6': 'identify-purpose',
  '1.4.1': 'use-of-color',
  '1.4.2': 'audio-control',
  '1.4.3': 'contrast-minimum',
  '1.4.4': 'resize-text',
  '1.4.5': 'images-of-text',
  '1.4.6': 'contrast-enhanced',
  '1.4.7': 'low-or-no-background-audio',
  '1.4.8': 'visual-presentation',
  '1.4.9': 'images-of-text-no-exception',
  '1.4.10': 'reflow',
  '1.4.11': 'non-text-contrast',
  '1.4.12': 'text-spacing',
  '1.4.13': 'content-on-hover-or-focus',
  '2.1.1': 'keyboard',
  '2.1.2': 'no-keyboard-trap',
  '2.1.3': 'keyboard-no-exception',
  '2.1.4': 'character-key-shortcuts',
  '2.2.1': 'timing-adjustable',
  '2.2.2': 'pause-stop-hide',
  '2.2.3': 'no-timing',
  '2.2.4': 'interruptions',
  '2.2.5': 're-authenticating',
  '2.2.6': 'timeouts',
  '2.3.1': 'three-flashes-or-below-threshold',
  '2.3.2': 'three-flashes',
  '2.3.3': 'animation-from-interactions',
  '2.4.1': 'bypass-blocks',
  '2.4.2': 'page-titled',
  '2.4.3': 'focus-order',
  '2.4.4': 'link-purpose-in-context',
  '2.4.5': 'multiple-ways',
  '2.4.6': 'headings-and-labels',
  '2.4.7': 'focus-visible',
  '2.4.8': 'location',
  '2.4.9': 'link-purpose-link-only',
  '2.4.10': 'section-headings',
  '2.4.11': 'focus-not-obscured-minimum',
  '2.4.12': 'focus-not-obscured-enhanced',
  '2.4.13': 'focus-appearance',
  '2.5.1': 'pointer-gestures',
  '2.5.2': 'pointer-cancellation',
  '2.5.3': 'label-in-name',
  '2.5.4': 'motion-actuation',
  '2.5.5': 'target-size-enhanced',
  '2.5.6': 'concurrent-input-mechanisms',
  '2.5.7': 'dragging-movements',
  '2.5.8': 'target-size-minimum',
  '3.1.1': 'language-of-page',
  '3.1.2': 'language-of-parts',
  '3.1.3': 'unusual-words',
  '3.1.4': 'abbreviations',
  '3.1.5': 'reading-level',
  '3.1.6': 'pronunciation',
  '3.2.1': 'on-focus',
  '3.2.2': 'on-input',
  '3.2.3': 'consistent-navigation',
  '3.2.4': 'consistent-identification',
  '3.2.5': 'change-on-request',
  '3.2.6': 'consistent-help',
  '3.3.1': 'error-identification',
  '3.3.2': 'labels-or-instructions',
  '3.3.3': 'error-suggestion',
  '3.3.4': 'error-prevention-legal-financial-data',
  '3.3.5': 'help',
  '3.3.6': 'error-prevention-all',
  '3.3.7': 'redundant-entry',
  '3.3.8': 'accessible-authentication-minimum',
  '3.3.9': 'accessible-authentication-enhanced',
  '4.1.2': 'name-role-value',
  '4.1.3': 'status-messages',
};

const NOMES_WCAG: Record<string, string> = {
  '1.1.1': 'Conteúdo não textual',
  '1.2.1': 'Apenas áudio e apenas vídeo (pré-gravado)',
  '1.2.2': 'Legendas (pré-gravadas)',
  '1.2.3': 'Audiodescrição ou mídia alternativa (pré-gravada)',
  '1.2.4': 'Legendas (ao vivo)',
  '1.2.5': 'Audiodescrição (pré-gravada)',
  '1.2.6': 'Língua de sinais (pré-gravada)',
  '1.2.7': 'Audiodescrição alargada (pré-gravada)',
  '1.2.8': 'Mídia alternativa (pré-gravada)',
  '1.2.9': 'Apenas áudio (ao vivo)',
  '1.3.1': 'Informações e relações',
  '1.3.2': 'Sequência com significado',
  '1.3.3': 'Características sensoriais',
  '1.3.4': 'Orientação',
  '1.3.5': 'Identificar o objetivo de entrada',
  '1.3.6': 'Identificar o objetivo',
  '1.4.1': 'Utilização de cores',
  '1.4.2': 'Controlo de áudio',
  '1.4.3': 'Contraste (mínimo)',
  '1.4.4': 'Redimensionar texto',
  '1.4.5': 'Imagens de texto',
  '1.4.6': 'Contraste (melhorado)',
  '1.4.7': 'Áudio de fundo baixo ou inexistente',
  '1.4.8': 'Apresentação visual',
  '1.4.9': 'Imagens de texto (sem exceção)',
  '1.4.10': 'Reorganização',
  '1.4.11': 'Contraste não textual',
  '1.4.12': 'Espaçamento de texto',
  '1.4.13': 'Conteúdo apresentado ao pairar ou focar',
  '2.1.1': 'Teclado',
  '2.1.2': 'Sem bloqueio de teclado',
  '2.1.3': 'Teclado (sem exceção)',
  '2.1.4': 'Atalhos de teclas de caracteres',
  '2.2.1': 'Ajustável por temporização',
  '2.2.2': 'Pôr em pausa, parar, ocultar',
  '2.2.3': 'Sem temporização',
  '2.2.4': 'Interrupções',
  '2.2.5': 'Nova autenticação',
  '2.2.6': 'Tempos limite',
  '2.3.1': 'Três flashes ou abaixo do limite',
  '2.3.2': 'Três flashes',
  '2.3.3': 'Animação a partir de interações',
  '2.4.1': 'Ignorar blocos',
  '2.4.2': 'Título da página',
  '2.4.3': 'Ordem de foco',
  '2.4.4': 'Objetivo do link (em contexto)',
  '2.4.5': 'Várias formas',
  '2.4.6': 'Cabeçalhos e rótulos',
  '2.4.7': 'Foco visível',
  '2.4.8': 'Localização',
  '2.4.9': 'Objetivo do link (apenas o link)',
  '2.4.10': 'Cabeçalhos da seção',
  '2.4.11': 'Foco não ofuscado (mínimo)',
  '2.4.12': 'Foco não ofuscado (melhorado)',
  '2.4.13': 'Aparência do foco',
  '2.5.1': 'Gestos de apontador',
  '2.5.2': 'Cancelamento do apontador',
  '2.5.3': 'Rótulo no nome',
  '2.5.4': 'Atuação por movimento',
  '2.5.5': 'Tamanho do alvo (melhorado)',
  '2.5.6': 'Mecanismos de entrada concorrentes',
  '2.5.7': 'Movimentos de arrastar',
  '2.5.8': 'Tamanho do alvo (mínimo)',
  '3.1.1': 'Idioma da página',
  '3.1.2': 'Idioma das partes',
  '3.1.3': 'Palavras incomuns',
  '3.1.4': 'Abreviaturas',
  '3.1.5': 'Nível de leitura',
  '3.1.6': 'Pronúncia',
  '3.2.1': 'Ao receber foco',
  '3.2.2': 'Ao receber uma entrada',
  '3.2.3': 'Navegação consistente',
  '3.2.4': 'Identificação consistente',
  '3.2.5': 'Alteração a pedido',
  '3.2.6': 'Ajuda consistente',
  '3.3.1': 'Identificação de erros',
  '3.3.2': 'Rótulos ou instruções',
  '3.3.3': 'Sugestão de erros',
  '3.3.4': 'Prevenção de erros (jurídicos, financeiros, dados)',
  '3.3.5': 'Ajuda',
  '3.3.6': 'Prevenção de erros (todos)',
  '3.3.7': 'Entrada redundante',
  '3.3.8': 'Autenticação acessível (mínimo)',
  '3.3.9': 'Autenticação acessível (melhorado)',
  '4.1.2': 'Nome, função, valor',
  '4.1.3': 'Mensagens de estado',
};

export function formatarReferenciasWcag(refs: string[] | undefined): string[] {
  if (!refs?.length) {
    return [];
  }

  const criterios = new Set<string>();
  for (const ref of refs) {
    const formatado = formatarCriterioWcag(ref);
    if (formatado) {
      criterios.add(formatado);
    }
  }

  return Array.from(criterios).sort(compararCriteriosWcag);
}

export function formatarCriterioWcag(raw: string): string | undefined {
  const tag = raw.trim();
  if (!tag) {
    return undefined;
  }

  let criterio: string | undefined;
  const formatted = FORMATTED_SC.exec(tag);
  if (formatted) {
    criterio = `${formatted[1]}.${formatted[2]}.${Number(formatted[3])}`;
  } else {
    const axe = AXE_SC_TAG.exec(tag);
    if (!axe) {
      return undefined;
    }
    criterio = `${axe[1]}.${axe[2]}.${Number(axe[3])}`;
  }

  if (!criterio || CRITERIOS_OBSOLETOS.has(criterio)) {
    return undefined;
  }

  return criterio;
}

export function urlGuidelineWcag(criterio: string): string {
  const slug = SLUGS_WCAG[criterio];
  return slug ? `${BASE_WCAG_PT_BR}#${slug}` : BASE_WCAG_PT_BR;
}

export function rotuloCriterioWcag(criterio: string): string {
  const nome = NOMES_WCAG[criterio];
  return nome ? `${criterio} ${nome}` : criterio;
}

function compararCriteriosWcag(a: string, b: string): number {
  const [a1, a2, a3] = a.split('.').map((n) => Number.parseInt(n, 10));
  const [b1, b2, b3] = b.split('.').map((n) => Number.parseInt(n, 10));
  if (a1 !== b1) return (a1 || 0) - (b1 || 0);
  if (a2 !== b2) return (a2 || 0) - (b2 || 0);
  return (a3 || 0) - (b3 || 0);
}
