import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'app-user-view',
    templateUrl: 'user.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserViewComponent {
    username: Observable<string> = this.route.paramMap.pipe(map(params => params.get('username')));
    constructor(private route: ActivatedRoute) {}
}
