import { definePreset } from '@primeuix/themes';
import AuraBase from '@primeuix/themes/aura/base';
import accordion from '@primeuix/themes/aura/accordion';
import avatar from '@primeuix/themes/aura/avatar';
import badge from '@primeuix/themes/aura/badge';
import button from '@primeuix/themes/aura/button';
import card from '@primeuix/themes/aura/card';
import chip from '@primeuix/themes/aura/chip';
import datatable from '@primeuix/themes/aura/datatable';
import dataview from '@primeuix/themes/aura/dataview';
import dialog from '@primeuix/themes/aura/dialog';
import divider from '@primeuix/themes/aura/divider';
import iconfield from '@primeuix/themes/aura/iconfield';
import inputtext from '@primeuix/themes/aura/inputtext';
// @ts-expect-error -- @primeuix/themes does not ship types for this subpath
import label from '@primeuix/themes/aura/label';
import menu from '@primeuix/themes/aura/menu';
import menubar from '@primeuix/themes/aura/menubar';
import message from '@primeuix/themes/aura/message';
import paginator from '@primeuix/themes/aura/paginator';
import password from '@primeuix/themes/aura/password';
import popover from '@primeuix/themes/aura/popover';
import ripple from '@primeuix/themes/aura/ripple';
import selectbutton from '@primeuix/themes/aura/selectbutton';
// @ts-expect-error -- @primeuix/themes does not ship types for this subpath
import sidebar from '@primeuix/themes/aura/sidebar';
import tabs from '@primeuix/themes/aura/tabs';
import tag from '@primeuix/themes/aura/tag';
import textarea from '@primeuix/themes/aura/textarea';
import toast from '@primeuix/themes/aura/toast';
import toggleswitch from '@primeuix/themes/aura/toggleswitch';
import tooltip from '@primeuix/themes/aura/tooltip';

export const argosPreset = definePreset(
  {
    ...AuraBase,
    components: {
      accordion,
      avatar,
      badge,
      button,
      card,
      chip,
      datatable,
      dataview,
      dialog,
      divider,
      iconfield,
      inputtext,
      label,
      menu,
      menubar,
      message,
      paginator,
      password,
      popover,
      ripple,
      selectbutton,
      sidebar,
      tabs,
      tag,
      textarea,
      toast,
      toggleswitch,
      tooltip,
    },
  },
  {
    semantic: {
      primary: {
        color: 'light-dark({primary.500}, {primary.400})',
        contrastColor: 'light-dark(#ffffff, {surface.900})',

        50: '{violet.50}',
        100: '{violet.100}',
        200: '{violet.200}',
        300: '{violet.300}',
        400: '{violet.400}',
        500: '{violet.500}',
        600: '{violet.600}',
        700: '{violet.700}',
        800: '{violet.800}',
        900: '{violet.900}',
        950: '{violet.950}',
      },
      extend: {
        app: {
          background: 'light-dark({surface.50}, {surface.950})',
        },
      },
    },
  },
);
