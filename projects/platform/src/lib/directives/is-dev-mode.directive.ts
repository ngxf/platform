import { Directive, EmbeddedViewRef, OnDestroy, TemplateRef, ViewContainerRef, isDevMode, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DevModeService {
  constructor() {}

  isDevMode() {
    return isDevMode();
  }
}

@Directive({
  selector: '[isDevMode]'
})
export class IsDevModeDirective implements OnDestroy {
  private viewRef: EmbeddedViewRef<null>;

  constructor(
    devModeService: DevModeService,
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<null>
  ) {
    if (devModeService.isDevMode()) {
      viewContainerRef.createEmbeddedView(templateRef);
    }
  }

  ngOnDestroy(): void {
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }
}
