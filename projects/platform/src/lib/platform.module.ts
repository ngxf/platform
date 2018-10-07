import { NgModule } from '@angular/core';
import {
  HttpDirective,
  RouteDirective,
  InitDirective,
  TimeoutDirective,
  ComposeDirective,
  ReturnDirective
} from './directives';

const DIRECTIVES = [
  HttpDirective,
  RouteDirective,
  InitDirective,
  TimeoutDirective,
  ComposeDirective,
  ReturnDirective
];

@NgModule({
  imports: [],
  declarations: [ DIRECTIVES ],
  exports: [ DIRECTIVES ]
})
export class NgxfModule { }
