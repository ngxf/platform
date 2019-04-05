import { Directive, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComposedView } from '../tools/recompose/composed.view';
import { omit } from '../tools/utils/index';

interface RenamePropContext {
  $implicit: null;
}

@Directive({ selector: '[renameProp]' })
export class RenamePropDirective implements OnChanges, OnDestroy {

  @Input() renameProp: string;
  @Input() renamePropTo: string;

  private context: RenamePropContext = {
    $implicit: null
  };
  private composedView: ComposedView<RenamePropContext>;

  constructor(
    private templateRef: TemplateRef<RenamePropContext>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('renameProp' in changes && 'renamePropTo' in changes) {
      this.onRenameDidChanged(
        this.renameProp, this.renamePropTo,
        changes.renameProp.previousValue, changes.renamePropTo.previousValue
      );
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  private onRenameDidChanged(from: string, to: string, fromPrevious: string, toPrevious: string) {
    if (!this.composedView) {
      this.create();
    }

    if (from !== fromPrevious || to !== toPrevious) {
      this.rename(from, to);
    }
  }

  private create() {
    this.composedView = new ComposedView<RenamePropContext>(this.viewContainerRef);
    this.composedView.createEmbeddedView(this.context);
  }

  private rename(from: string, to: string) {
    this.composedView.updateContext((context, parent) => {
      return Object.assign(
        context,
        omit(parent, [ from ]),
        { [ to ]: parent[ from ] }
      );
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
