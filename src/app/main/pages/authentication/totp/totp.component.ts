import { Component, OnInit, ViewEncapsulation, AfterViewInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AwsAuthService } from '@fuse/services/aws-auth.service';

@Component({
    selector     : 'totp',
    templateUrl  : './totp.component.html',
    styleUrls    : ['./totp.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class TotpComponent implements OnInit, AfterContentChecked
{
    totpForm: FormGroup;
    user: any;
    code: string;
    username: string;
    qrString: string;
    public myAngularxQrCode: string = null;
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
        this.aws.firstTimeIsUserLoggedIn();
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
        console.log('hello');
        
        this.totpForm = this._formBuilder.group({
         
            totp: ['', Validators.required]
        });
       
        // this.aws.generateTOTP(this.user);
    }
    ngAfterContentChecked(): any {
        if (this.aws.totpCode){
            this.code = this.aws.totpCode;
            this.username = this.aws.awsUserName;
            this.myAngularxQrCode = `otpauth://totp/AWSCognito:${this.username}?secret=${this.code}&issuer=Example`;
           
            
        }
    }
    totp(): void {
        this.aws.signInWithTOTP(this.totpForm.value.totp);
        
    }
}
