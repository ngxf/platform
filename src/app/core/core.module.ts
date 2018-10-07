import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheInterceptor } from './interceptors';

@NgModule({
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
    ]
})
export class CoreModule {}
