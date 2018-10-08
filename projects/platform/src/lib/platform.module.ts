import { NgModule } from '@angular/core';
import {
    HttpDirective,
    RouteDirective,
    InitDirective,
    TimeoutDirective,
    ComposeDirective,
    ReturnDirective,
    CookiesDirective
} from './directives';

const DIRECTIVES = [
    HttpDirective,
    RouteDirective,
    InitDirective,
    TimeoutDirective,
    ComposeDirective,
    ReturnDirective,
    CookiesDirective
];

@NgModule({
    imports: [],
    declarations: [DIRECTIVES],
    exports: [DIRECTIVES]
})
export class NgxfModule {
}
