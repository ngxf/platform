import { Directive, Input, ViewContainerRef, TemplateRef, OnDestroy } from '@angular/core';

@Directive({ selector: '[timeout]' })
export class TimeoutDirective implements OnDestroy {

    private timeoutId: number;

    constructor(
        private templateRef: TemplateRef<null>,
        private viewContainerRef: ViewContainerRef
    ) {}

    @Input() set timeout(milliseconds: number) {
        this.dispose();
        this.create(milliseconds);
    }

    ngOnDestroy() {
        this.dispose();
    }

    private create(milliseconds: number) {
        this.timeoutId = setTimeout(() => {
            if (this.viewContainerRef) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        }, milliseconds) as any as number;
    }

    private dispose() {
        this.viewContainerRef.clear();
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}
