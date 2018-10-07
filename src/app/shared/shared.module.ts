import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxfModule } from '@ngxf/platform';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule } from '@angular/material';

import { UserComponent } from './user';

const COMPONENTS = [
    UserComponent
];

@NgModule({
    imports: [ CommonModule, NgxfModule ],
    declarations: [ COMPONENTS ],
    exports: [
        CommonModule,
        COMPONENTS,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule
    ]
})
export class SharedModule {}
