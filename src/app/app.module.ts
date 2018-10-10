import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './layout/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from './core';
import { SharedModule } from './shared';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

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
      {
        path: '', component: NavComponent, children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          { path: 'dashboard', loadChildren: './view/dashboard/dashboard.module#DashboardViewModule' },
          { path: 'users', loadChildren: './view/users/users.module#UsersViewModule' }
        ]
      } ], {}),
    AngularFireModule.initializeApp(environment.firebase),
    CoreModule,
    SharedModule,
    LayoutModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
