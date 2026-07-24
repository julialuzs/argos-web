import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const argosPreset = definePreset(Aura, {
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
  },
});
