import { NgModule } from '@angular/core';
import { AsyncDirective, ComposeDirective, CookiesDirective, HttpDirective, InitDirective, ReturnDirective, RouteDirective, TimeoutDirective } from './directives';

const DIRECTIVES = [
  AsyncDirective,
  ComposeDirective,
  CookiesDirective,
  HttpDirective,
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
export class NgxfModule {}
