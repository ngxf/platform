import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
import { UserViewComponent } from './user';
import { UsersViewComponent } from './users.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: '', component: UsersViewComponent },
            { path: ':username', component: UserViewComponent }
        ])
    ],
    declarations: [
        UsersViewComponent,
        UserViewComponent
    ]
})
export class UsersViewModule {}
