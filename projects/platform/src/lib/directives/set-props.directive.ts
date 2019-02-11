import { Directive, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComposedView } from '../tools/recompose/composed.view';

interface SetPropsContext {
  $implicit: any;
  setProps: any;
}

@Directive({ selector: '[setProps]' })
export class SetPropsDirective implements OnChanges, OnDestroy {

  @Input() setProps: any;

  private context: SetPropsContext = { $implicit: null, setProps: null };
  private composedView: ComposedView<SetPropsContext>;

  constructor(
    private templateRef: TemplateRef<SetPropsContext>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('setProps' in changes) {
      this.onPropsDidChanged(this.setProps, changes.setProps.previousValue);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  private onPropsDidChanged(current: TemplateRef<SetPropsContext>[], previous: TemplateRef<SetPropsContext>[]) {
    if (!this.context.$implicit) {
      return current && this.create(current);
    }

    if (current !== previous) {
      this.destroy();
      return this.onPropsDidChanged(current, null);
    }
  }

  private create(props: any) {
    this.composedView = new ComposedView<SetPropsContext>(this.viewContainerRef);
    this.composedView.createEmbeddedView(this.context);
    this.composedView.updateContext((context, parent) => {
      return Object.assign(context, parent, props);
    });
  }

  private destroy() {
    this.viewContainerRef.clear();
    if (this.composedView) {
      this.composedView.destroy();
      this.composedView = null;
    }
  }
}
