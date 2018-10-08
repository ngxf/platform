import { Inject, Injectable, Optional } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

export interface CookieOptionsArgs {
    path?: string;
    domain?: string;
    expires?: string | Date;
    secure?: boolean;
}

export interface ICookies {
    [key: string]: string[];
}

export interface ICookieService {
    get(key: string): string;
    set(key: string, value: string, options?: CookieOptionsArgs): void;
    remove(key: string, options?: CookieOptionsArgs): void;
}

export class CookieOptions {

    public path: string;
    public domain: string;
    public expires: string | Date;
    public secure: boolean;

    constructor({ path, domain, expires, secure }: CookieOptionsArgs = {}) {
        this.path = this.isPresent(path) ? path : null;
        this.domain = this.isPresent(domain) ? domain : null;
        this.expires = this.isPresent(expires) ? expires : null;
        this.secure = this.isPresent(secure) ? secure : false;
    }

    public merge(options?: CookieOptionsArgs): CookieOptions {
        return new CookieOptions(<CookieOptionsArgs>{
            path: this.isPresent(options) && this.isPresent(options.path) ? options.path : this.path,
            domain: this.isPresent(options) && this.isPresent(options.domain) ? options.domain : this.domain,
            expires: this.isPresent(options) && this.isPresent(options.expires) ? options.expires : this.expires,
            secure: this.isPresent(options) && this.isPresent(options.secure) ? options.secure : this.secure,
        });
    }

    private isPresent(obj: any): boolean {
        return obj !== undefined && obj !== null;
    }
}

@Injectable({
    providedIn: 'root'
})
export class BaseCookieOptions extends CookieOptions {
    constructor(@Optional() @Inject(APP_BASE_HREF) private baseHref: string) {
        super({ path: baseHref || '/' });
    }
}

@Injectable({
    providedIn: 'root'
})
export class CookiesService implements ICookieService {

    constructor(
        @Optional() private defaultOptions?: CookieOptions
    ) {
    }

    protected get cookieString(): string {
        return document.cookie || '';
    }

    protected set cookieString(val: string) {
        document.cookie = val;
    }

    private cookieReader(key: string): string {
        const currentCookieString = this.cookieString;

        if (currentCookieString) {
            const cookieArray = currentCookieString.split('; ');

            return cookieArray.reduce((cookies: ICookies, current: string) => {
                const cookie = current.split('=');

                return { ...cookies, [cookie[0]]: decodeURIComponent(cookie[1]) };
            }, {})[key];
        }
    }

    private cookieWriter(name: string, value: string, options?: CookieOptionsArgs) {
        this.cookieString = this.buildCookieString(name, value, options);
    }

    private buildCookieString(name: string, value: string, options?: CookieOptionsArgs): string {
        const defaultOpts = this.defaultOptions || new CookieOptions(<CookieOptionsArgs>{ path: '/' });
        const opts: CookieOptions = this.mergeOptions(defaultOpts, options);

        let expires = opts.expires;

        if (!value) {
            expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
            value = '';
        }

        if (typeof expires === 'string') {
            expires = new Date(expires);
        }

        let str = encodeURIComponent(name) + '=' + encodeURIComponent(value);

        str += opts.path ? `;path=${opts.path}` : '';
        str += opts.domain ? `;domain=${opts.domain}` : '';
        str += expires ? `;expires=${expires.toUTCString()}` : '';
        str += opts.secure ? ';secure' : '';

        const cookieLength = str.length + 1;

        if (cookieLength > 4096) {
            console.log(`Cookie \'${name}\' possibly not set or overflowed because it was too large (${cookieLength} > 4096 bytes)!`);
        }

        return str;
    }

    private mergeOptions(defaultOpts: CookieOptions, providedOpts?: CookieOptionsArgs): CookieOptions {
        const newOpts = defaultOpts;

        if (providedOpts) {
            return newOpts.merge(new CookieOptions(providedOpts));
        }

        return newOpts;
    }

    public get(key: string): string {
        return this.cookieReader(key);
    }

    public set(key: string, value: string, options?: CookieOptionsArgs): void {
        this.cookieWriter(key, value, options);
    }

    public remove(key: string, options?: CookieOptionsArgs): void {
        this.cookieWriter(key, undefined, options);
    }
}
