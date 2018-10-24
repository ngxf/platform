import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { AsyncDirective, ComposeDirective, CookiesDirective, HttpDirective, LazyDirective, LAZY_COMPONENT_TOKEN, InitDirective, ReturnDirective, RouteDirective, TimeoutDirective } from './directives';

const DIRECTIVES = [
  AsyncDirective,
  ComposeDirective,
  CookiesDirective,
  HttpDirective,
  LazyDirective,
  InitDirective,
  ReturnDirective,
  RouteDirective,
  TimeoutDirective
];

@NgModule({
  imports: [],
  declarations: [ DIRECTIVES ],
  exports: [ DIRECTIVES ]
})
export class NgxfModule {
  static forLazy(component: Type<any>): ModuleWithProviders {
    return {
      ngModule: NgxfModule,
      providers: [
        { provide: LAZY_COMPONENT_TOKEN, useValue: component },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: component, multi: true }
      ]
    };
  }
}
