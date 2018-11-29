import { NgModule } from '@angular/core';

import { SocketIODirective, SocketIOOnDirective } from './directives';

const DIRECTIVES = [
  SocketIODirective,
  SocketIOOnDirective
];

@NgModule({
  declarations: [ DIRECTIVES ],
  exports: [ DIRECTIVES ]
})
export class NgxfSocketIOModule {}
