import { NgModule } from '@angular/core';
import { HttpDirective, RouteDirective } from './directives';

@NgModule({
  imports: [],
  declarations: [HttpDirective, RouteDirective],
  exports: [HttpDirective, RouteDirective]
})
export class NgxfModule { }
