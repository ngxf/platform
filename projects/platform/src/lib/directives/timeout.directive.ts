import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';

@Directive({ selector: '[timeout]' })
export class TimeoutDirective {

    constructor(
        private templateRef: TemplateRef<null>,
        private viewContainerRef: ViewContainerRef
    ) {
    }

    @Input() set timeout(milliseconds: number) {
        this.viewContainerRef.clear();

        setTimeout(() => {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }, milliseconds);
    }
}
