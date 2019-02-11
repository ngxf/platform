import { ChangeDetectorRef, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { VirtualHandler } from '../tools/virtual.handler';

@Directive({ selector: '[virtual]' })
export class VirtualDirective implements OnDestroy {
  @Input() virtual: any;

  constructor(
    private handler: VirtualHandler,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {
    this.handler.register(this.elementRef.nativeElement, cd);
  }

  ngOnDestroy() {
    this.handler.unregister(this.elementRef.nativeElement);
  }
}
