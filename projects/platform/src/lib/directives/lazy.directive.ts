import {
  ComponentFactory,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  EventEmitter,
  InjectionToken,
  Injector,
  Input,
  NgModuleFactory,
  NgModuleFactoryLoader,
  NgModuleRef,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef
} from '@angular/core';
import { from, Observable, SubscriptionLike } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface LazyContext {
  $implicit: any;
}

export const LAZY_COMPONENT_TOKEN = new InjectionToken<Type<any>>('Lazy Component Token');

@Directive({ selector: '[lazy]' })
export class LazyDirective implements OnChanges, OnDestroy {

  @Input() lazy: string;
  @Input() lazyLoadChildren: string;
  @Input() lazyActivate: (component: any) => void;
  @Input() lazyDeactivate: (component: any) => void;

  @Output() activate: EventEmitter<any> = new EventEmitter<any>();
  @Output() deactivate: EventEmitter<any> = new EventEmitter<any>();

  private context: LazyContext = {
    $implicit: null
  };

  private get component(): any {
    if (this.componentRef) {
      return this.componentRef.instance;
    }
  }

  private componentRef: ComponentRef<any>;

  private get projectableNodes(): any[][] {
    return [ this.templateRef.createEmbeddedView(this.context).rootNodes ];
  }

  private embeddedViewRef: EmbeddedViewRef<LazyContext> =
    this.templateRef.createEmbeddedView(this.context);

  private subscription: SubscriptionLike;
  private ngModuleRef: NgModuleRef<any>;

  constructor(
    private templateRef: TemplateRef<LazyContext>,
    private viewContainer: ViewContainerRef,
    private loader: NgModuleFactoryLoader,
    private injector: Injector
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('lazy' in changes) {
      this.onLazyDidChanged(this.lazy, changes.lazy.previousValue);
    }

    if ('lazyLoadChildren' in changes) {
      this.onLazyDidChanged(this.lazyLoadChildren, changes.lazyLoadChildren.previousValue);
    }
  }

  ngOnDestroy() {
    this.dispose();

    if (this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
      this.embeddedViewRef = null;
    }
  }

  private onLazyDidChanged(current: string, previous: string): void {
    if (!this.ngModuleRef) {
      return current && this.loadAndRender(current);
    }

    if (current !== previous) {
      this.dispose();
      return this.onLazyDidChanged(current, null);
    }
  }

  private loadAndRender(path: string): void {
    this.subscription = this.load(path).pipe(
      tap((ngModuleFactory: NgModuleFactory<any>) => {
        this.ngModuleRef = ngModuleFactory.create(this.injector);

        const component: Type<any> = this.ngModuleRef.injector.get(LAZY_COMPONENT_TOKEN);
        const componentFactory: ComponentFactory<any> =
          this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(component);

        this.componentRef = this.viewContainer.createComponent(
          componentFactory, this.viewContainer.length, this.injector,
          this.projectableNodes, this.ngModuleRef
        );
      }),
      finalize(() => this.onActivate(this.component))
    ).subscribe();
  }

  private load(path: string): Observable<NgModuleFactory<any>> {
    const pathProduction = path.split('#').join('.ts#');
    return from(this.loader.load(pathProduction)).pipe(
      catchError(() => from(this.loader.load(path)))
    );
  }

  private onActivate(component: any): void {
    this.activate.emit(component);
    if (isFunction(this.lazyActivate)) {
      this.lazyActivate(component);
    }
    this.context.$implicit = component;
    this.embeddedViewRef.markForCheck();
  }

  private onDeactivate(component: any): void {
    this.deactivate.emit(component);
    if (isFunction(this.lazyDeactivate)) {
      this.lazyDeactivate(component);
    }
    this.context.$implicit = null;
    this.embeddedViewRef.markForCheck();
  }

  private dispose(): void {
    if (this.componentRef) {
      const c = this.component;
      this.componentRef.destroy();
      this.componentRef = null;
      this.onDeactivate(c);
    }

    if (this.ngModuleRef) {
      this.ngModuleRef.destroy();
      this.ngModuleRef = null;
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

}

function isFunction(value: any): value is Function {
  return typeof value === 'function';
}
