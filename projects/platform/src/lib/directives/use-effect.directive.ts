import {
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[useEffect]'
})
export class UseEffectDirective implements OnChanges, DoCheck, OnDestroy {
  private context: {} = {};

  @Input() useEffect: Function;
  @Input() useEffectOn: [];

  private onDestroyCallback: Function;

  private viewRef: EmbeddedViewRef<{}>;

  constructor(
    private templateRef: TemplateRef<{}>,
    private vcr: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.useEffect && this.useEffect) {
      this.destroy();
      this.init();
    } else if (changes.useEffectOn) {
      if (Array.isArray(this.useEffectOn)) {
        const previous = changes.useEffectOn.previousValue || [];
        const current = changes.useEffectOn.currentValue || [];

        const isChanged = !previous.every((item, index) => current[index] === item);

        if (isChanged) {
          this.destroy();
          this.init();
        }
      } else {
        this.destroy();
        this.init();
      }
    }
  }

  ngDoCheck() {
    if (!Array.isArray(this.useEffectOn)) {
      this.destroy();
      this.init();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  private init() {
    this.viewRef = this.vcr.createEmbeddedView(this.templateRef, this.context);
    if (this.useEffect) {
      this.onDestroyCallback = this.useEffect();
    }
  }

  private destroy() {
    if (this.onDestroyCallback) {
      this.onDestroyCallback();
      this.onDestroyCallback = null;
    }

    this.vcr.clear();

    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }
}
