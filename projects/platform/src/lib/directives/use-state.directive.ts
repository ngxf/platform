import { Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

interface UseStateContext<T = any> {
  $implicit: {
    get: T,
    set: (value: T) => void;
    detectChanges: Function;
  };
}

@Directive({
  selector: '[useState]'
})
export class UseStateDirective implements OnChanges, OnDestroy {
  @Input() useStateOf: any;

  private context: UseStateContext = {
    $implicit: {
      get: this.useStateOf,
      set(value: any) {
        this.get = value;
        this.detectChanges();
      },
      detectChanges: () => {
        this.embeddedViewRef.detectChanges();
      }
    }
  };
  private embeddedViewRef: EmbeddedViewRef<UseStateContext> =
    this.vcr.createEmbeddedView(this.templateRef, this.context);

  constructor(
    private templateRef: TemplateRef<UseStateContext>,
    private vcr: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.useStateOf) {
      this.context.$implicit.get = this.useStateOf;
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear();
    this.embeddedViewRef.destroy();
    this.embeddedViewRef = null;
  }

}
