import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { ConfirmComponent } from './confirm.component';




const routes = [
    {
        path     : 'auth/confirm',
        component: ConfirmComponent
    }
];

@NgModule({
    declarations: [
        ConfirmComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,

        FuseSharedModule
    ]
})
export class ConfirmModule
{
}
