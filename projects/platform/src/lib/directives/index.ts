import { AsyncDirective } from './async.directive';
import { ComposeDirective, ReturnDirective } from './compose.directive';
import { CookiesDirective } from './cookies.directive';
import { HttpDirective } from './http.directive';
import { LazyDirective } from './lazy.directive';
import { InitDirective } from './init.directive';
import { RouteDirective } from './route.directive';
import { TimeoutDirective } from './timeout.directive';

export const DIRECTIVES = [
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

export * from './async.directive';
export * from './compose.directive';
export * from './cookies.directive';
export * from './http.directive';
export * from './lazy.directive';
export * from './init.directive';
export * from './route.directive';
export * from './timeout.directive';
