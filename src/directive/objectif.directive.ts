import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPercentageColor]'
})
export class PercentageColorDirective implements OnChanges {
  @Input() appPercentageColor!: number | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.appPercentageColor != null) {
      const color = this.appPercentageColor < 100 ? '#9b2223' : '#279649'; // Rouge si < 100, Vert sinon
      this.renderer.setStyle(this.el.nativeElement, 'color', color);
      this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    }
  }
}
