import { Directive, Input, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ComposedView } from '../tools/recompose/composed.view';

interface ReturnContext {
  $implicit: null;
}

@Directive({ selector: '[return]' })
export class ReturnDirective implements OnChanges, OnDestroy {

  @Input() return: any;

  private context: ReturnContext = {
    $implicit: null
  };
  private composedView: ComposedView<ReturnContext>;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('return' in changes) {
      if (!this.composedView) {
        this.create();
      } else {
        this.update();
      }
    }
  }

  ngOnDestroy() {
    if (this.composedView) {
      this.composedView.destroy();
      this.composedView = null;
    }
  }

  private create() {
    this.composedView = new ComposedView(this.viewContainerRef);
    this.composedView.createEmbeddedView(this.context);
    this.update();
  }

  private update() {
    this.composedView.updateContext((context) => {
      return Object.assign(context, this.return);
    });
  }

}
