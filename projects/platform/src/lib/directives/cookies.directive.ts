import { Directive, Input, TemplateRef, ViewContainerRef, EmbeddedViewRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CookieOptionsArgs, CookiesService } from '../tools/cookies.tools';

enum CookiesStrategies {
  GET = 'get',
  SET = 'set',
  REMOVE = 'remove'
}

interface CookiesContext {
  $implicit: any;
  data: any;
}

interface CookiesStrategy {
  type: CookiesStrategies;
  changes: string[];
  require: string[];
}

const COOKIES_CONFIG: CookiesStrategy[] = [
  {
    type: CookiesStrategies.GET,
    changes: [ 'cookiesGet' ],
    require: [ 'cookiesGet' ]
  },
  {
    type: CookiesStrategies.SET,
    changes: [
      'cookiesSet',
      'cookiesValue',
      'cookiesPath',
      'cookiesDomain',
      'cookiesExpires',
      'cookiesSecure'
    ],
    require: [ 'cookiesSet' ]
  },
  {
    type: CookiesStrategies.REMOVE,
    changes: [ 'cookiesRemove', 'cookiesPath', 'cookiesDomain' ],
    require: [ 'cookiesRemove' ]
  }
];

@Directive({ selector: '[cookies]' })
export class CookiesDirective implements OnChanges, OnDestroy {

  @Input() private cookiesGet: string;
  @Input() private cookiesSet: string;
  @Input() private cookiesRemove: string;
  @Input() private cookiesValue: any;

  @Input() private cookiesPath: string;
  @Input() private cookiesDomain: string;
  @Input() private cookiesExpires: string | Date;
  @Input() private cookiesSecure: boolean;

  private context: CookiesContext = {
    $implicit: null,
    get data() { return this.$implicit; }
  };

  private viewRef: EmbeddedViewRef<CookiesContext> =
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);

  constructor(
    private templateRef: TemplateRef<CookiesContext>,
    private viewContainerRef: ViewContainerRef,
    private cookiesService: CookiesService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const strategy: CookiesStrategy = this.findStrategy(changes);

    if (strategy) {
      this.execute(strategy);
    }
  }

  ngOnDestroy() {
    this.viewContainerRef.clear();
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }

  private findStrategy(changes: SimpleChanges): CookiesStrategy {
    return COOKIES_CONFIG.find((strategy) => {
      return strategy.changes.some(field => !!changes[ field ])
        && strategy.require.every(field => !!this[ field ]);
    });
  }

  private execute(strategy: CookiesStrategy): void {
    const options = strategy.changes.map(field => this[ field ]);

    this.action(strategy.type, ...options);
  }

  private action(type: string, ...options: string[]): void {
    const name = options[ 0 ];
    const value = options[ 1 ];
    const cookieOptions: CookieOptionsArgs = {
      path: options[ 2 ],
      domain: options[ 3 ],
      expires: options[ 4 ],
      secure: !!options[ 5 ]
    };

    if (CookiesStrategies.GET === type) {
      this.context.$implicit = this.getCookie(name);
    }

    if (CookiesStrategies.SET === type) {
      this.setCookie(name, value, cookieOptions);
      this.context.$implicit = value;
    }

    if (CookiesStrategies.REMOVE === type) {
      this.removeCookie(name, cookieOptions);
      this.context.$implicit = null;
    }

    this.viewRef.markForCheck();
  }

  private getCookie(name: string): string {
    return this.cookiesService.get(name);
  }

  private setCookie(name: string, value: string, options?: CookieOptionsArgs): void {
    this.cookiesService.set(name, value, options);
  }

  private removeCookie(name: string, options?: CookieOptionsArgs): void {
    this.cookiesService.remove(name, options);
  }
}
