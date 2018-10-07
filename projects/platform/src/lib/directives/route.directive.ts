import { OnDestroy, Directive, Type, TemplateRef, ViewContainerRef, EmbeddedViewRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, UrlSegment, Params, Data, Route, ParamMap, convertToParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

interface RouteContext {
    $implicit: ActivatedRoute;
    snapshot: ActivatedRouteSnapshot;
    url: UrlSegment[];
    params: Params;
    queryParams: Params;
    fragment: string;
    data: Data;
    outlet: string;
    component: Type<any> | string;
    routeConfig: Route;
    root: ActivatedRoute;
    parent: ActivatedRoute | null;
    firstChild: ActivatedRoute | null;
    children: ActivatedRoute[];
    pathFromRoot: ActivatedRoute[];
    paramMap: ParamMap;
    queryParamMap: ParamMap;
}

const ASYNC_FIELDS = ['url', 'params', 'queryParams', 'fragment', 'data', 'paramMap', 'queryParamMap'];

@Directive({ selector: '[route]' })
export class RouteDirective implements OnDestroy {
    private context: RouteContext = {
        $implicit: this.route,
        get snapshot() { return this.route.snapshot; },
        url: [],
        params: {},
        queryParams: {},
        fragment: null,
        data: null,
        get outlet() { return this.route.outlet; },
        get component() { return this.route.component; },
        get routeConfig() { return this.route.routeConfig; },
        get root() { return this.route.root; },
        get parent() { return this.route.parent; },
        get firstChild() { return this.route.firstChild; },
        get children() { return this.route.children; },
        get pathFromRoot() { return this.route.pathFromRoot; },
        paramMap: convertToParamMap({}),
        queryParamMap: convertToParamMap({})
    };
    private viewRef: EmbeddedViewRef<RouteContext> =
        this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
    private subscriptions: Subscription[] = this.attachFields(ASYNC_FIELDS);

    constructor(
        private templateRef: TemplateRef<RouteContext>,
        private viewContainerRef: ViewContainerRef,
        private route: ActivatedRoute
    ) { }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions = null;
    }

    private attachFields(asyncFields: string[]): Subscription[] {
        return asyncFields.map(field => this.asyncAttach(field));
    }

    private asyncAttach(field: string): Subscription {
        return this.route[field]
            .pipe(distinctUntilChanged())
            .subscribe(value => {
                this.context[field] = value;
                this.viewRef.markForCheck();
            });
    }
}
