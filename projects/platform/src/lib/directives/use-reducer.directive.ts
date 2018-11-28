import { Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

interface Action {
  type: string;
  payload: any;
}

type Reducer<T = any> = (state: T, action: Action) => T;

interface UseReducerImplicitContext<T> {
  state: T;
  dispatch: (action: Action) => T;
  reducer: Reducer;
  detectChanges: Function;
}

interface UseReducerContext<T = any> {
  $implicit: UseReducerImplicitContext<T>;
}

@Directive({
  selector: '[useReducer]'
})
export class UseReducerDirective implements OnChanges, OnDestroy {
  @Input() useReducerInit: Reducer;
  @Input() useReducerWith: any;
  @Input() useReducerAnd: Action;

  private context: UseReducerContext = {
    $implicit: {
      state: null,
      dispatch (action: Action): any {
        this.state = this.reducer(this.state, action);
        this.detectChanges();
      },
      reducer: (() => {}),
      detectChanges: () => {
        this.embeddedViewRef.detectChanges();
      }
    }
  };
  private embeddedViewRef: EmbeddedViewRef<UseReducerContext> =
    this.vcr.createEmbeddedView(this.templateRef, this.context);

  constructor(
    private templateRef: TemplateRef<UseReducerContext>,
    private vcr: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.useReducerInit && typeof this.useReducerInit === 'function') {
      this.context.$implicit.reducer = this.useReducerInit;
      this.context.$implicit.state = this.useReducerWith;
      if (this.useReducerAnd) {
        this.context.$implicit.dispatch(this.useReducerAnd);
      }
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear();
    this.embeddedViewRef.destroy();
    this.embeddedViewRef = null;
  }

}
