import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NavComponent } from './layout/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from './core';
import { SharedModule } from './shared';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: NavComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        { path: 'dashboard', loadChildren: './view/dashboard/dashboard.module#DashboardViewModule' },
        { path: 'users', loadChildren: './view/users/users.module#UsersViewModule' }
      ]
    }], {  }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    CoreModule,
    SharedModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
