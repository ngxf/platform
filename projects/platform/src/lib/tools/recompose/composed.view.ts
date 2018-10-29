import { ElementRef, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { omit } from '../utils';

export const PARENT_CONTEXT_TOKEN = Symbol('[PARENT_CONTEXT_TOKEN]');

export interface ComposedContext {
  [ PARENT_CONTEXT_TOKEN ]: TemplateRef<ComposedContext>[];
  children: ComposedView<ComposedContext>;

  [ key: string ]: any;
}

export class ComposedView<C> {

  elementRef: ElementRef;

  private context: ComposedContext;
  private viewRef: EmbeddedViewRef<ComposedContext>;

  constructor(private viewContainerRef: ViewContainerRef, private templateRefs?: TemplateRef<any>[]) {}

  createEmbeddedView(context: C): EmbeddedViewRef<C> {
    const [ templateRef, ...tail ] = this.getParentTemplateRefs();
    this.context = context as any as ComposedContext;
    if (tail.length > 0) {
      this.elementRef = templateRef.elementRef;
      this.context[ PARENT_CONTEXT_TOKEN ] = tail;
      this.context.children = new ComposedView<ComposedContext>(this.viewContainerRef, tail);
    }
    this.viewRef =
      this.viewContainerRef.createEmbeddedView(templateRef, this.context);

    return this.viewRef as any as EmbeddedViewRef<C>;
  }

  markForCheck(): void {
    if (this.viewRef) {
      this.viewRef.markForCheck();
    }
  }

  detectChanges(): void {
    if (this.viewRef) {
      this.viewRef.detectChanges();
    }
  }

  updateContext(update: (context: any, parent: any) => any) {
    const parent = this.getHydratedParentContext();
    update(this.context, parent);
    this.markForCheck();
  }

  destroy() {
    if (this.viewRef && !this.viewRef.destroyed) {
      this.viewRef.destroy();
    }
    this.viewRef = null;
  }

  private getParentTemplateRefs(): TemplateRef<ComposedContext>[] {
    if (this.templateRefs) {
      return this.templateRefs;
    }

    const view = (this.viewContainerRef.injector as any).view;
    const context: ComposedContext = findParentContext(view);
    return context[ PARENT_CONTEXT_TOKEN ];
  }

  private getHydratedParentContext(): any {
    const view = (this.viewContainerRef.injector as any).view;
    return omit(findParentContext(view), [ PARENT_CONTEXT_TOKEN, 'children' ]);
  }
}

export function findParentContext(view: any): ComposedContext {
  const context: any = view.context;

  if (isParentContext(context)) {
    return context;
  }

  return findParentContext(view.parent);
}

export function isParentContext(context: any): context is ComposedContext {
  return context && PARENT_CONTEXT_TOKEN in context;
}
