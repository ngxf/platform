import { Directive, Input, TemplateRef, ViewContainerRef, EmbeddedViewRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface HttpContext {
    $implicit: any;
    data: any;
}

@Directive({ selector: '[http]' })
export class HttpDirective {

    @Input() set httpGet(url: string) { this.request('get', url); }
    @Input() set httpPost(url: string) { this.request('post', url); }

    private context: HttpContext = {
        $implicit: null,
        get data() { return this.$implicit; }
    };

    private viewRef: EmbeddedViewRef<HttpContext> =
        this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);

    constructor(
        private http: HttpClient,
        private templateRef: TemplateRef<HttpContext>,
        private viewContainerRef: ViewContainerRef
    ) { }

    private request(method, url) {
        this.http[method](url)
            .pipe(catchError(() => of(null)))
            .subscribe((data) => {
                this.context.$implicit = data;
                this.viewRef.markForCheck();
            });
    }
}