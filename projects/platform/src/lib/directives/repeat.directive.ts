import { Directive, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

export class RepeatContext {
  $implicit: number;
  repeat: number;
  index: number;
}

@Directive({ selector: '[repeat]' })
export class RepeatDirective implements OnChanges, OnDestroy {

  @Input() repeat: number;
  @Input() repeatOf: number;

  get count(): number {
    const count = isNumber(this.repeat) ? this.repeat :
      isNumber(this.repeatOf) ? this.repeatOf : 0;

    return Math.max(count, 0);
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<RepeatContext>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('repeat' in changes || 'repeatOf' in changes) {
      this.onRepeatChanged(this.count);
    }
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }

  private onRepeatChanged(count: number): void {
    /** When we need to create new items */
    for (let i = this.viewContainerRef.length; i < count; i++) {
      this.viewContainerRef.createEmbeddedView(this.templateRef, {
        $implicit: i, index: i, repeat: i
      }, i);
    }

    /** When we need to remove old items */
    for (let i = this.viewContainerRef.length; i > count; i--) {
      this.viewContainerRef.remove(i - 1);
    }
  }

}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}
