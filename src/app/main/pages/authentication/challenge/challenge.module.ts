import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { ChallengeComponent } from './challenge.component';




const routes = [
    {
        path     : 'auth/challenge',
        component: ChallengeComponent
    }
];

@NgModule({
    declarations: [
        ChallengeComponent
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
export class ChallengeModule
{
}
