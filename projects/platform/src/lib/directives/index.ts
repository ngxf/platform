import { HttpDirective } from './http.directive';
import { RouteDirective } from './route.directive';
import { InitDirective } from './init.directive';
import { TimeoutDirective } from './timeout.directive';
import { ComposeDirective, ReturnDirective } from './compose.directive';

export const DIRECTIVES = [
    HttpDirective,
    RouteDirective,
    InitDirective,
    TimeoutDirective,
    ComposeDirective,
    ReturnDirective
];

export * from './http.directive';
export * from './route.directive';
export * from './init.directive';
export * from './timeout.directive';
export * from './compose.directive';
