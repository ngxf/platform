import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {
    @Input() username: string;
}
