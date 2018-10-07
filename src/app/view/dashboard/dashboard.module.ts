import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
import { DashboardViewComponent } from './dashboard.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: '', component: DashboardViewComponent }
        ])
    ],
    declarations: [ DashboardViewComponent ]
})
export class DashboardViewModule { }
