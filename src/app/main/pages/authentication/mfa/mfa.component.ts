import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AwsAuthService } from '@fuse/services/aws-auth.service';

@Component({
    selector     : 'mfa',
    templateUrl  : './mfa.component.html',
    styleUrls    : ['./mfa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MFAComponent implements OnInit
{
    mfaForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private aws: AwsAuthService
    )
    {
        this.aws.isUserLoggedIn();
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.mfaForm = this._formBuilder.group({
            mfa   : ['', [Validators.required]]
        });
    }
    mfa(): void {
        this.aws.signInWithTOTP(this.mfaForm.value.mfa);
    }
}
