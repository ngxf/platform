import { ɵComponentDef as ComponentDef, ɵmarkDirty as markDirty } from '@angular/core';
import { from, Observable, ReplaySubject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';

const componentDefKey = 'ɵcmp';
const componentFactoryKey = 'ɵfac';

const onInitHook = Symbol('ngOnInit');
const onDestroyHook = Symbol('ngOnDestroy');

type Mutable<T> = {
  -readonly[P in keyof T]: T[P]
};

export type ObservableMap<T> = {
  [P in keyof T]: Observable<T[P]>;
};

interface ComponentHooks {
  [onInitHook]: ReplaySubject<null>;
  [onDestroyHook]: ReplaySubject<null>;
}

type ConnectedContext<T> = ObservableMap<T> & {
  [onInitHook]: (target: any) => void;
  [onDestroyHook]: () => void;
};

class ComponentHooksMap<T extends object> {

  private linker = new WeakMap<T, ComponentHooks>();

  init(component: T): void {
    if (!this.linker.has(component)) {
      this.linker.set(component, {
        [onInitHook]: new ReplaySubject<null>(1),
        [onDestroyHook]: new ReplaySubject<null>(1)
      });
    }
  }

  invoke(component: T, hook: keyof ComponentHooks): void {
    const signal = this.linker.get(component)[hook];
    signal.next();
    signal.complete();
  }

  attach<C>(component: T, destination: ConnectedContext<C>): void {
    const onInit = this.linker.get(component)[onInitHook];
    onInit.subscribe(() => destination[onInitHook](component));

    const onDestroy = this.linker.get(component)[onDestroyHook];
    onDestroy.subscribe(() => destination[onDestroyHook]());
  }

  detach(component: T): void {
    if (this.linker.has(component)) {
      this.linker.get(component)[onInitHook].complete();
      this.linker.get(component)[onDestroyHook].complete();
      this.linker.delete(component);
    }
  }

}

class ComponentAsyncMap<T extends object> {

  private linker = new WeakMap<T, any>();

  dispose(component: T) {
    if (this.linker.has(component)) {
      this.linker.get(component)[onDestroyHook]();
      this.linker.delete(component);
    }
  }

  set(component: T, value: any): void {
    this.linker.set(component, value);
  }

  get(component: T): any {
    return this.linker.get(component);
  }
}

export function Async<T extends Function>(): PropertyDecorator {
  const hooksMap = new ComponentHooksMap<T>();
  return function(target: any, propertyKey: string): void {
    const asyncMap = new ComponentAsyncMap<T>();
    Object.defineProperty(target, propertyKey, {
      set: function(this: T, value: any) {
        hooksMap.init(this);
        asyncMap.dispose(this);
        asyncMap.set(this, value);
        hooksMap.attach(this, value);
      },
      get: function(this: T): any {
        return asyncMap.get(this);
      }
    });

    const componentDef: Mutable<ComponentDef<T>> =
      target.constructor[componentDefKey];

    const componentFactoryFn = target.constructor[componentFactoryKey];
    target.constructor[componentFactoryKey] = function(this: T, ...args: any[]) {
      const instance = componentFactoryFn.apply(this, args);
      hooksMap.init(instance);

      return instance;
    };

    const onInitFn = componentDef.onInit;
    componentDef.onInit = function(this: T) {
      hooksMap.invoke(this, onInitHook);
      if (onInitFn) {
        onInitFn.call(this);
      }
    };

    const onDestroyFn = componentDef.onDestroy;
    componentDef.onDestroy = function(this: T) {
      hooksMap.invoke(this, onDestroyHook);
      if (onDestroyFn) {
        onDestroyFn.call(this);
      }
      hooksMap.detach(this);
    };
  };
}

export function connect<T>(sources: ObservableMap<T>): T {
  const onDestroySubject = new ReplaySubject(1);
  const context = {
    [onInitHook]: function(component: any) {
      const sourceKeys = Object.keys(sources);
      const onUpdate = from(sourceKeys).pipe(
        mergeMap(sourceKey => {
          const source = sources[sourceKey];

          return source.pipe(
            tap((value: any) => {
              context[sourceKey] = value;
            })
          );
        })
      );

      onUpdate
        .pipe(takeUntil(onDestroySubject))
        .subscribe(() => markDirty(component));
    },
    [onDestroyHook]: function() {
      onDestroySubject.next();
      onDestroySubject.complete();
    }
  } as ConnectedContext<T>;

  return (context as unknown) as T;
}
