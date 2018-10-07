import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-users-view',
    templateUrl: 'users.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersViewComponent {}
