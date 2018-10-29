import { Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComposedView } from '../tools';

interface NestContext {
  $implicit: any;
  nest: any;
}

@Directive({ selector: '[nest]' })
export class NestDirective implements OnChanges, OnDestroy {

  @Input() nest: TemplateRef<NestContext>[];
  @Input() nestOf: TemplateRef<NestContext>[];

  private context: NestContext = { $implicit: null, nest: null };
  private viewRef: EmbeddedViewRef<NestContext>;

  constructor(
    private templateRef: TemplateRef<NestContext>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('nest' in changes) {
      this.onTemplatesDidChanged(this.nest, changes.nest.previousValue);
    }

    if ('nestOf' in changes) {
      this.onTemplatesDidChanged(this.nestOf, changes.nestOf.previousValue);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  private onTemplatesDidChanged(current: TemplateRef<NestContext>[], previous: TemplateRef<NestContext>[]) {
    if (!this.context.$implicit) {
      return current && this.create(current);
    }

    if (current !== previous) {
      this.destroy();
      this.onTemplatesDidChanged(current, null);
    }
  }

  private create(templateRefs: TemplateRef<NestContext>[]) {
    this.context.$implicit = this.context.nest = new ComposedView<NestContext>(this.viewContainerRef, templateRefs);
    this.viewRef =
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
  }

  private update(templateRefs: TemplateRef<NestContext>[]) {
    this.context.$implicit = this.context.nest = new ComposedView<NestContext>(this.viewContainerRef, templateRefs);
    this.viewRef.markForCheck();
  }

  private destroy() {
    this.viewContainerRef.clear();
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }
}
