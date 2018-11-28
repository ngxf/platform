import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule, Type } from '@angular/core';
import {
  AsyncDirective,
  ComposeDirective,
  CookiesDirective,
  HttpDirective,
  InitDirective,
  LAZY_COMPONENT_TOKEN,
  LazyDirective,
  NestDirective,
  RenamePropDirective,
  ReturnDirective,
  RouteDirective,
  SetPropsDirective,
  TimeoutDirective,
  UseReducerDirective,
  UseStateDirective
} from './directives';
import { CallPipe } from './pipes';

const DIRECTIVES = [
  AsyncDirective,
  ComposeDirective,
  CookiesDirective,
  HttpDirective,
  LazyDirective,
  InitDirective,
  NestDirective,
  RenamePropDirective,
  ReturnDirective,
  RouteDirective,
  SetPropsDirective,
  TimeoutDirective,
  UseReducerDirective,
  UseStateDirective
];

const PIPES = [
  CallPipe
];

@NgModule({
  imports: [],
  declarations: [ DIRECTIVES, PIPES ],
  exports: [ DIRECTIVES, PIPES ]
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
