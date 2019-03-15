import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule, Type } from '@angular/core';

import { AsyncDirective } from './directives/async.directive';
import { ComposeDirective } from './directives/compose.directive';
import { CookiesDirective } from './directives/cookies.directive';
import { HttpDirective } from './directives/http.directive';
import { InitDirective } from './directives/init.directive';
import { LazyDirective, LAZY_COMPONENT_TOKEN } from './directives/lazy.directive';
import { NestDirective } from './directives/nest.directive';
import { RenamePropDirective } from './directives/rename-prop.directive';
import { ReturnDirective } from './directives/return.directive';
import { RouteDirective } from './directives/route.directive';
import { SetPropsDirective } from './directives/set-props.directive';
import { TimeoutDirective } from './directives/timeout.directive';
import { NgForTrackByKeyDirective } from './directives/track-by-key.directive';
import { UseEffectDirective } from './directives/use-effect.directive';
import { UseReducerDirective } from './directives/use-reducer.directive';
import { UseStateDirective } from './directives/use-state.directive';
import { VirtualDirective } from './directives/virtual.directive';

import { CallPipe } from './pipes/call.pipe';

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
  NgForTrackByKeyDirective,
  UseReducerDirective,
  UseStateDirective,
  UseEffectDirective,
  VirtualDirective
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

export { UseEffect } from './ivy-hooks/use-effect.hook';
export { UseReducer } from './ivy-hooks/use-reducer.hook';
export { UseState } from './ivy-hooks/use-state.hook';
