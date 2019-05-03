import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSnackBarModule } from '@angular/material';
import { QRCodeModule } from 'angularx-qrcode';
import { FuseSharedModule } from '@fuse/shared.module';
import { TotpComponent } from './totp.component';



const routes = [
    {
        path     : 'auth/totp',
        component: TotpComponent
    }
];

@NgModule({
    declarations: [
        TotpComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        QRCodeModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,

        FuseSharedModule
    ]
})
export class TotpModule
{
}
