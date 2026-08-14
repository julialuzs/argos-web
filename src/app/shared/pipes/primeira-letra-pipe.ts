import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primeiraLetra',
})
export class PrimeiraLetraPipe implements PipeTransform {
  transform(value: string, capitalizar = true): string {
    if (!value) return '';
    const letra = value.charAt(0);
    return capitalizar ? letra.toUpperCase() : letra;
  }
}
