import { NgModule } from '@angular/core';

import { SocketIODirective } from './directives/socket.io.directive';
import { SocketIOOnDirective } from './directives/socket.io.on.directive';

const DIRECTIVES = [
  SocketIODirective,
  SocketIOOnDirective
];

@NgModule({
  declarations: [ DIRECTIVES ],
  exports: [ DIRECTIVES ]
})
export class NgxfSocketIOModule {}

export { SocketIODirective } from './directives/socket.io.directive';
export { SocketIOOnDirective } from './directives/socket.io.on.directive';
