import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface InitContext {
    $implicit: any;
    init: any;
}

@Directive({selector: '[init]'})
export class InitDirective {

    @Input() set init(val: any) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef, {init: val});
    }

    constructor(
        private templateRef: TemplateRef<InitContext>,
        private viewContainer: ViewContainerRef
    ) {
    }
}
