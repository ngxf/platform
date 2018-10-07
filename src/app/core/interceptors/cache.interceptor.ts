import { Injectable } from '@angular/core';
import { HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const TTL = 1200;

@Injectable({ providedIn: 'root' })
export class RequestCacheService {
    private cache = new Map<string, [Date, HttpResponse<any>]>();

    get(key): HttpResponse<any> {
        const tuple = this.cache.get(key);
        if (!tuple) {
            return null;
        }

        const expires = tuple[0];
        const httpResponse = tuple[1];

        // Don't observe expired keys
        const now = new Date();
        if (expires && expires.getTime() < now.getTime()) {
            this.cache.delete(key);
            return null;
        }

        return httpResponse;
    }

    set(key, value, ttl = null) {
        if (ttl) {
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + ttl);
            this.cache.set(key, [expires, value]);
        } else {
            this.cache.set(key, [null, value]);
        }
    }
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    constructor(private cache: RequestCacheService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const cachedResponse = this.cache.get(req.url);
        return cachedResponse
            ? of(cachedResponse)
            : this.sendRequest(req, next);
    }

    sendRequest(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cache.set(req.url, event, TTL);
                }
            })
        );
    }
}
