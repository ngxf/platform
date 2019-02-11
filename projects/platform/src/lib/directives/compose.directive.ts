import { Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComposedContext, ComposedView } from '../tools/recompose/composed.view';

interface ComposeContext {
  $implicit: ComposeFn<any>;
  compose: ComposeFn<any>;
}

type ComposeFn<T> = (templateRef: TemplateRef<T> | ComposedView<T>) => ComposedView<T>;

@Directive({ selector: '[compose]' })
export class ComposeDirective implements OnChanges, OnDestroy {

  @Input() compose: TemplateRef<any>[];
  @Input() composeOf: TemplateRef<any>[];

  private context: ComposeContext = { $implicit: null, compose: null };
  private viewRef: EmbeddedViewRef<ComposeContext>;

  constructor(
    private templateRef: TemplateRef<ComposeContext>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('compose' in changes) {
      this.onTemplateRefsDidChanged(this.compose, changes.compose.previousValue);
    }

    if ('composeOf' in changes) {
      this.onTemplateRefsDidChanged(this.composeOf, changes.composeOf.previousValue);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  private onTemplateRefsDidChanged(current: TemplateRef<any>[], previous: TemplateRef<any>[]): void {
    if (!this.viewRef) {
      return this.create(current);
    }

    if (this.viewRef.destroyed || current !== previous) {
      this.destroy();
      return this.onTemplateRefsDidChanged(current, null);
    }
  }

  private create(templateRefs) {
    this.context.compose = this.context.$implicit = this.createComposeFn(templateRefs);
    this.viewRef =
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
  }

  private destroy() {
    if (this.viewRef && !this.viewRef.destroyed) {
      this.viewRef.destroy();
    }

    this.viewRef = null;
  }

  private createComposeFn(templateRefs: TemplateRef<any>[]): ComposeFn<any> {
    return (templateRef: TemplateRef<any> | ComposedView<any>): ComposedView<any> => {
      return new ComposedView<any>(
        this.viewContainerRef,
        [ ...templateRefs, templateRef ]
      );
    };
  }
}
