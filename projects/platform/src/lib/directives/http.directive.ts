import { Directive, Input, TemplateRef, ViewContainerRef, EmbeddedViewRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

enum HttpStrategies {
  DELETE = 'delete',
  GET = 'get',
  HEAD = 'head',
  JSONP = 'jsonp',
  OPTIONS = 'options',
  PATCH = 'patch',
  POST = 'post',
  PUT = 'put'
}

interface HttpContext {
  $implicit: any;
  data: any;
}

interface HttpStrategy {
  type: HttpStrategies;
  changes: string[];
  require: string[];
}

const HTTP_CONFIG: HttpStrategy[] = [
  {
    type: HttpStrategies.DELETE,
    changes: [ 'httpDelete', 'httpWith' ],
    require: [ 'httpDelete' ]
  },
  {
    type: HttpStrategies.GET,
    changes: [ 'httpGet', 'httpWith' ],
    require: [ 'httpGet' ]
  },
  {
    type: HttpStrategies.HEAD,
    changes: [ 'httpHead', 'httpWith' ],
    require: [ 'httpHead' ]
  },
  {
    type: HttpStrategies.JSONP,
    changes: [ 'httpJsonp', 'httpCallback' ],
    require: [ 'httpJsonp', 'httpCallback' ]
  },
  {
    type: HttpStrategies.OPTIONS,
    changes: [ 'httpOptions', 'httpWith' ],
    require: [ 'httpOptions' ]
  },
  {
    type: HttpStrategies.PATCH,
    changes: [ 'httpPatch', 'httpSend', 'httpWith' ],
    require: [ 'httpPatch' ]
  },
  {
    type: HttpStrategies.POST,
    changes: [ 'httpPost', 'httpSend', 'httpWith' ],
    require: [ 'httpPost' ]
  },
  {
    type: HttpStrategies.PUT,
    changes: [ 'httpPut', 'httpSend', 'httpWith' ],
    require: [ 'httpPut' ]
  }
];

@Directive({ selector: '[http]' })
export class HttpDirective implements OnChanges, OnDestroy {

  @Input() httpDelete: string;
  @Input() httpGet: string;
  @Input() httpHead: string;
  @Input() httpJsonp: string;
  @Input() httpOptions: string;
  @Input() httpPatch: string;
  @Input() httpPost: string;
  @Input() httpPut: string;

  @Input() httpSend: any;
  @Input() httpCallback: string;
  @Input() httpWith: any;

  private context: HttpContext = {
    $implicit: null,
    get data() { return this.$implicit; }
  };

  private viewRef: EmbeddedViewRef<HttpContext> =
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);

  private subscription: Subscription;

  constructor(
    private http: HttpClient,
    private templateRef: TemplateRef<HttpContext>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const strategy: HttpStrategy = this.findStrategy(changes);
    if (strategy) {
      this.execute(strategy);
    }
  }

  ngOnDestroy() {
    this.dispose();
    this.viewContainerRef.clear();
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }

  private findStrategy(changes: SimpleChanges): HttpStrategy {
    return HTTP_CONFIG.find((strategy) => {
      return strategy.changes.some(field => !!changes[ field ])
        && strategy.require.every(field => !!this[ field ]);
    });
  }

  private execute(strategy: HttpStrategy) {
    const params = strategy.changes.map(field => this[ field ]);

    this.request(strategy.type, ...params);
  }

  private request(method, ...params) {
    this.dispose();
    this.subscription = this.http[ method ](...params)
      .pipe(catchError((e) => {
        console.error(e);
        return of(null);
      }))
      .subscribe((data) => {
        this.context.$implicit = data;
        this.viewRef.markForCheck();
      });
  }

  private dispose() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
