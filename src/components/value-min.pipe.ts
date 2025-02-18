import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minValue'
})
export class MinValuePipe implements PipeTransform {
  transform(value: number, minValue: number): number {
    return Math.min(value, minValue);
  }
}
