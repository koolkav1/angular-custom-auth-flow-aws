import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AwsAuthService } from '@fuse/services/aws-auth.service';

@Component({
    selector     : 'confirm',
    templateUrl  : './confirm.component.html',
    styleUrls    : ['./confirm.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ConfirmComponent implements OnInit
{
    confirmForm: FormGroup;
    user: any;
    code: string;
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
        this.confirmForm = this._formBuilder.group({
         
            confirm: ['', Validators.required]
        });
       
    }
    confirm(): void {
        this.aws.confirmSignUp(this.confirmForm.value.confirm);
        
    }
}
