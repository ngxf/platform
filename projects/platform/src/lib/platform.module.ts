import { NgModule } from '@angular/core';
import * as directives from './directives';

@NgModule({
  imports: [],
  declarations: [...directives.list],
  exports: [...directives.list]
})
export class NgxfModule { }
