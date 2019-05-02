import { Directive, Injectable, OnDestroy, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';

export type TemplateDef = any;

export const enum KeepAliveFlags {
  Detached,
  Attached
}

export class ViewRefAttachable {

  viewRef: ViewRef;

  flag: KeepAliveFlags = KeepAliveFlags.Detached;

  viewContainerRef: ViewContainerRef;

  get attached(): boolean {
    return this.flag === KeepAliveFlags.Attached;
  }

  get detached(): boolean {
    return this.flag === KeepAliveFlags.Detached;
  }

  constructor(viewRef: ViewRef) {
    this.viewRef = viewRef;
  }

  attachToViewContainerRef(viewContainer: ViewContainerRef): void {
    if (this.viewContainerRef || this.attached) {
      throw new TypeError(`You can't use *keepAlive with *ngFor:
  <ng-container *ngFor="...">
    <!-- Wrong! -->
    <ng-container *keepAlive></ng-container>
  </ng-container>

viewRef already attached to viewContainerRef`);
    }

    this.flag = KeepAliveFlags.Attached;
    (this.viewContainerRef = viewContainer).insert(this.viewRef);
  }

  detachFromViewContainerRef(): void {
    if (!this.viewContainerRef || this.detached) {
      throw new TypeError('viewRef already detached from viewContainerRef');
    }

    this.flag = KeepAliveFlags.Detached;
    this.viewContainerRef.detach(this.viewContainerRef.indexOf(this.viewRef));
    delete this.viewContainerRef;
  }

  destroy(): void {
    this.viewRef.destroy();
  }
}

@Injectable({ providedIn: 'root' })
export class KeepAliveConfig {
  limit: number = 50;
}

@Injectable({ providedIn: 'root',  })
export class KeepAliveGC {
  constructor(private config: KeepAliveConfig) {}

  collect(viewRefs: Map<TemplateDef, ViewRefAttachable>): void {
    const limit = this.config.limit > 0 ? this.config.limit : Number.MAX_SAFE_INTEGER;
    for (const [templateDef, viewRefAttachable] of Array.from(viewRefs.entries())) {
      if (viewRefs.size <= limit) {
        break;
      }

      if (viewRefAttachable.flag === KeepAliveFlags.Detached) {
        viewRefAttachable.destroy();
        viewRefs.delete(templateDef);
        console.log('Collect', viewRefAttachable);
      }
    }
  }
}

@Injectable({ providedIn: 'root' })
export class KeepAliveViewRefs implements OnDestroy {

  private viewRefs: Map<TemplateDef, ViewRefAttachable> = new Map<TemplateDef, ViewRefAttachable>();

  constructor(private gc: KeepAliveGC) {}

  add(templateRef: TemplateRef<any>, viewRef: ViewRef): void {
    const templateDef = this.getTemplateDef(templateRef);
    if (this.viewRefs.has(templateDef)) {
      throw new TypeError('templateRef already exists in viewRefs');
    }

    const viewRefAttachable = new ViewRefAttachable(viewRef);
    this.viewRefs.set(templateDef, viewRefAttachable);
  }

  has(templateRef: TemplateRef<any>): boolean {
    const templateDef = this.getTemplateDef(templateRef);
    return this.viewRefs.has(templateDef);
  }

  get(templateRef: TemplateRef<any>): ViewRefAttachable {
    const templateDef = this.getTemplateDef(templateRef);
    if (!this.viewRefs.has(templateDef)) {
      throw new TypeError('templateRef not exists in viewRefs');
    }
    return this.viewRefs.get(templateDef);
  }

  delete(templateRef: TemplateRef<any>): boolean {
    const templateDef = this.getTemplateDef(templateRef);
    if (!this.viewRefs.has(templateDef)) {
      throw new TypeError('templateRef not exists in viewRefs');
    }
    this.viewRefs.get(templateRef).viewRef.destroy();
    return this.viewRefs.delete(templateDef);
  }

  reattach(templateRef: TemplateRef<any>): void {
    const templateDef = this.getTemplateDef(templateRef);
    const viewRefAttachable = this.get(templateRef);
    this.viewRefs.set(templateDef, viewRefAttachable);
  }

  ngOnDestroy(): void {
    this.viewRefs.forEach((viewRefAttachable) =>
      viewRefAttachable.viewRef.destroy());
    this.viewRefs.clear();
  }

  collect(): void {
    this.gc.collect(this.viewRefs);
  }

  forEach(fn: (v: ViewRefAttachable) => void): void {
    this.viewRefs.forEach(fn);
  }

  private getTemplateDef(templateRef: TemplateRef<any>): TemplateDef {
    return templateRef['_def'];
  }
}

@Injectable({ providedIn: 'root' })
export class KeepAliveManager {
  static patched = Symbol('Already Patched ViewContainerRef Token');

  constructor(private viewRefs: KeepAliveViewRefs) {}

  attach(viewContainerRef: ViewContainerRef, templateRef: TemplateRef<any>): void {
    if (!this.viewRefs.has(templateRef)) {
      const viewRef = templateRef.createEmbeddedView({});
      this.viewRefs.add(templateRef, viewRef);
    } else {
      this.viewRefs.reattach(templateRef);
    }

    this.patchClear(viewContainerRef);

    const viewRefAttachable = this.viewRefs.get(templateRef);
    viewRefAttachable.attachToViewContainerRef(viewContainerRef);

    this.viewRefs.collect();
  }

  detach(viewContainerRef: ViewContainerRef, templateRef: TemplateRef<any>): void {
    const viewRefAttachable = this.viewRefs.get(templateRef);
    viewRefAttachable.detachFromViewContainerRef();

    this.viewRefs.collect();
  }

  private patchClear(viewContainerRef: ViewContainerRef): void {
    if (!viewContainerRef[KeepAliveManager.patched]) {
      const clear = Object.getPrototypeOf(viewContainerRef).clear;
      const viewRefs = this.viewRefs;
      Object.getPrototypeOf(viewContainerRef).clear = function (this: ViewContainerRef) {
        viewRefs.forEach(v => { v.viewRef[ '_view' ].state |= (1 << 7); });
        clear.call(this);
        viewRefs.forEach(v => { v.viewRef[ '_view' ].state &= ~(1 << 7); });
      };
      Object.defineProperty(viewContainerRef, KeepAliveManager.patched, { get: () => true });
    }
  }

}

@Directive({
  selector: '[keepAlive]'
})
export class KeepAliveDirective implements OnDestroy {
  constructor(
    private manager: KeepAliveManager,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {
    manager.attach(viewContainerRef, templateRef);
  }

  ngOnDestroy(): void {
    this.manager.detach(this.viewContainerRef, this.templateRef);
  }
}
