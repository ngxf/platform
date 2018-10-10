import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared';
import { ChatViewComponent } from './chat.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: '', component: ChatViewComponent }
        ])
    ],
    declarations: [ ChatViewComponent ]
})
export class ChatViewModule { }
