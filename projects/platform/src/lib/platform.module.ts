import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule, Type } from '@angular/core';

import { AsyncDirective } from './directives/async.directive';
import { ComposeDirective } from './directives/compose.directive';
import { CookiesDirective } from './directives/cookies.directive';
import { HttpDirective } from './directives/http.directive';
import { InitDirective } from './directives/init.directive';
import { IsDevModeDirective } from './directives/is-dev-mode.directive';
import { KeepAliveConfig, KeepAliveDirective } from './directives/keep-alive.directive';
import { LazyDirective, LAZY_COMPONENT_TOKEN } from './directives/lazy.directive';
import { NestDirective } from './directives/nest.directive';
import { RenamePropDirective } from './directives/rename-prop.directive';
import { RepeatDirective } from './directives/repeat.directive';
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
import { ConsolePipe } from './pipes/console.pipe';

const DIRECTIVES = [
  AsyncDirective,
  ComposeDirective,
  CookiesDirective,
  HttpDirective,
  LazyDirective,
  InitDirective,
  IsDevModeDirective,
  KeepAliveDirective,
  NestDirective,
  RenamePropDirective,
  RepeatDirective,
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
  CallPipe,
  ConsolePipe
];

@NgModule({
  imports: [],
  declarations: [ DIRECTIVES, PIPES ],
  exports: [ DIRECTIVES, PIPES ]
})
export class NgxfModule {
  static forLazy(component: Type<any>): ModuleWithProviders<NgxfModule> {
    return {
      ngModule: NgxfModule,
      providers: [
        { provide: LAZY_COMPONENT_TOKEN, useValue: component },
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: component, multi: true }
      ]
    };
  }
  static forKeepAlive(keepAliveConfig: KeepAliveConfig): ModuleWithProviders<NgxfModule> {
    return {
      ngModule: NgxfModule,
      providers: [
        { provide: KeepAliveConfig, useValue: keepAliveConfig }
      ]
    };
  }
}

export { AsyncDirective } from './directives/async.directive';
export { ComposeDirective } from './directives/compose.directive';
export { CookiesDirective } from './directives/cookies.directive';
export { HttpDirective } from './directives/http.directive';
export { InitDirective } from './directives/init.directive';
export { IsDevModeDirective } from './directives/is-dev-mode.directive';
export { KeepAliveDirective, KeepAliveConfig, KeepAliveGC } from './directives/keep-alive.directive';
export { LazyDirective, LAZY_COMPONENT_TOKEN } from './directives/lazy.directive';
export { NestDirective } from './directives/nest.directive';
export { RenamePropDirective } from './directives/rename-prop.directive';
export { RepeatDirective } from './directives/repeat.directive';
export { ReturnDirective } from './directives/return.directive';
export { RouteDirective } from './directives/route.directive';
export { SetPropsDirective } from './directives/set-props.directive';
export { TimeoutDirective } from './directives/timeout.directive';
export { NgForTrackByKeyDirective } from './directives/track-by-key.directive';
export { UseEffectDirective } from './directives/use-effect.directive';
export { UseReducerDirective } from './directives/use-reducer.directive';
export { UseStateDirective } from './directives/use-state.directive';
export { VirtualDirective } from './directives/virtual.directive';

export { CallPipe } from './pipes/call.pipe';
export { ConsolePipe } from './pipes/console.pipe';

export { UseEffect } from './ivy-hooks/use-effect.hook';
export { UseReducer } from './ivy-hooks/use-reducer.hook';
export { UseState } from './ivy-hooks/use-state.hook';
