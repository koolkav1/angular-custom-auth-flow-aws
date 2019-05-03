import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AwsAuthService } from '@fuse/services/aws-auth.service';
import { AuthService2 } from '@fuse/services/aws-2-auth.service';

@Component({
    selector     : 'challenge',
    templateUrl  : './challenge.component.html',
    styleUrls    : ['./challenge.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ChallengeComponent implements OnInit
{
    challengeForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private aws: AwsAuthService,
        private auth: AuthService2
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
        this.challengeForm = this._formBuilder.group({
            challenge   : ['', [Validators.required]]
        });
    }
    challenge(): void {
        this.auth.sendChallenge(this.challengeForm.value.challenge);
    }
}
