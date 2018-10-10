import { NgModule } from '@angular/core';
import { FireCollectionDirective } from './directives';

const DIRECTIVES = [
  FireCollectionDirective
];

@NgModule({
  declarations: [DIRECTIVES],
  exports: [DIRECTIVES]
})
export class NgxfFireModule { }
