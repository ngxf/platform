import { Directive, Input, ViewContainerRef, TemplateRef, EmbeddedViewRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

const COMPOSED_CONTEXT_TOKEN = '[COMPOSED_CONTEXT_TOKEN]';

interface ComposedContext {
  $implicit: any;
  templateRefs: TemplateRef<ComposedContext>[];

  [ key: string ]: any;
}

class ComposedView {

  private context: ComposedContext = {
    $implicit: null,
    templateRefs: [],
    [ COMPOSED_CONTEXT_TOKEN ]: COMPOSED_CONTEXT_TOKEN
  };
  private viewRef: EmbeddedViewRef<ComposedContext>;

  constructor(private viewContainerRef: ViewContainerRef) {}

  render($implicit: any, templateRefs: TemplateRef<ComposedContext>[]) {
    this.viewContainerRef.clear();
    this.context.$implicit = $implicit;

    const [ templateRef, ...tail ] = templateRefs;
    this.context.templateRefs = tail;
    this.viewRef =
      this.viewContainerRef.createEmbeddedView(templateRef, this.context);
  }

  update($implicit: any) {
    if (this.viewRef) {
      this.context.$implicit = $implicit;
      this.viewRef.markForCheck();
    }
  }

  destroy() {
    this.viewContainerRef.clear();
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }
}

@Directive({ selector: '[compose]' })
export class ComposeDirective implements OnChanges, OnDestroy {
  @Input() composeOf: TemplateRef<ComposedContext>[];
  @Input() composeUse: any;

  private get templateRefs(): TemplateRef<ComposedContext>[] {
    return this.composeOf;
  }

  private composedView: ComposedView;

  constructor(
    private templateRef: TemplateRef<ComposedContext>,
    viewContainerRef: ViewContainerRef
  ) {
    this.composedView = new ComposedView(viewContainerRef);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.composeOf && this.composeOf) {
      return this.render();
    }

    if (changes.composeUse && this.composeOf) {
      return this.update();
    }

    if (changes.composeOf && !this.composeOf) {
      return this.destroy();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  private render() {
    const templateRefs = [ ...this.templateRefs, this.templateRef ];
    this.composedView.render(this.composeUse, templateRefs);
  }

  private update() {
    this.composedView.update(this.composeUse);
  }

  private destroy() {
    this.composedView.destroy();
  }
}

@Directive({ selector: '[return]' })
export class ReturnDirective implements OnDestroy {
  @Input() set return(value: any) {
    if (this.templateRefsChanged) {
      this.previousTemplateRefs = this.templateRefs;
      this.composedView.render(value, this.templateRefs);
    } else {
      this.composedView.update(value);
    }
  }

  private composedView: ComposedView;

  private previousTemplateRefs: TemplateRef<ComposedContext>[];

  private get templateRefs(): TemplateRef<ComposedContext>[] {
    const view = (this.viewContainerRef.injector as any).view;
    const context: ComposedContext = findParentContext(view);
    return context.templateRefs;
  }

  private get templateRefsChanged(): boolean {
    return this.previousTemplateRefs !== this.templateRefs;
  }

  constructor(private viewContainerRef: ViewContainerRef) {
    this.composedView = new ComposedView(viewContainerRef);
  }

  ngOnDestroy() {
    this.composedView.destroy();
  }

}

function findParentContext(view: any): ComposedContext {
  const context: any = view.context;

  if (isComposedContext(context)) {
    return context;
  }

  return findParentContext(view.parent);
}

function isComposedContext(context: any): context is ComposedContext {
  return context && context[ COMPOSED_CONTEXT_TOKEN ];
}
