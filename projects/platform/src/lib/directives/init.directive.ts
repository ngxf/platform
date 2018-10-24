import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface InitContext {
  $implicit: any;
}

@Directive({ selector: '[init]' })
export class InitDirective {

  @Input() set initOf(value: any) {
    this.context.$implicit = value;
    this.viewRef.markForCheck();
  }

  private context: InitContext = { $implicit: null };
  private viewRef: EmbeddedViewRef<InitContext> =
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);

  constructor(
    private templateRef: TemplateRef<InitContext>,
    private viewContainer: ViewContainerRef
  ) { }

}
