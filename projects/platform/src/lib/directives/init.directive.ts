import { Directive, EmbeddedViewRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

interface InitContext<T> {
  $implicit: T;
  init: T;
}

@Directive({ selector: '[init]' })
export class InitDirective<T> implements OnDestroy {

  @Input() set init(value: T) {
    this.setValue(value);
  }

  @Input() set initOf(value: T) {
    this.setValue(value);
  }

  private context: InitContext<T> = { $implicit: null, init: null };
  private viewRef: EmbeddedViewRef<InitContext<T>> =
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);

  constructor(
    private templateRef: TemplateRef<InitContext<T>>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnDestroy() {
    this.viewContainer.clear();
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }

  private setValue(value: T): void {
    this.context.$implicit = this.context.init = value;
    if (this.viewRef) {
      this.viewRef.markForCheck();
    }
  }

}
