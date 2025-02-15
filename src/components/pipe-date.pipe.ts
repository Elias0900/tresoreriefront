import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeDate'
})
export class PipeDatePipe implements PipeTransform {

  transform(value: Date | string | null): string {
    if (!value) return '';

    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Assure "MM" avec 2 chiffres

    return `${year}-${month}`;
  }
}
