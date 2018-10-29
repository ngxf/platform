import { AsyncDirective } from './async.directive';
import { ComposeDirective } from './compose.directive';
import { CookiesDirective } from './cookies.directive';
import { HttpDirective } from './http.directive';
import { LazyDirective } from './lazy.directive';
import { InitDirective } from './init.directive';
import { NestDirective } from './nest.directive';
import { RenamePropDirective } from './rename-prop.directive';
import { ReturnDirective } from './return.directive';
import { RouteDirective } from './route.directive';
import { SetPropsDirective } from './set-props.directive';
import { TimeoutDirective } from './timeout.directive';

export const DIRECTIVES = [
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
  TimeoutDirective
];

export * from './async.directive';
export * from './compose.directive';
export * from './cookies.directive';
export * from './http.directive';
export * from './lazy.directive';
export * from './init.directive';
export * from './nest.directive';
export * from './rename-prop.directive';
export * from './return.directive';
export * from './route.directive';
export * from './set-props.directive';
export * from './timeout.directive';
