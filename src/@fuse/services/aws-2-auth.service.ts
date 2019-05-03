import { Injectable } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
    MatSnackBar, MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material';


@Injectable({
    providedIn: 'root'
})

export class AuthService2 {

    awsConfirm: any;
    code: any;
    awsUser: any;
    awsUserName: string;
    currentUser: Observable<any>;
    signedIn: any;
    currentUserSnapshot: any;
    forgotPasswordUsername: string;
    totpCode: string;
    userForTotp: any;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    currentMfaType: string;

    constructor(private amplifyService: AmplifyService,
        public snackBar: MatSnackBar,
        private router: Router) {
    }

    storeUserName(username: string): void {
        this.awsUserName = username;
    }

    newLoginUser(username: string, password: string): void {
        this.awsUserName = username;
        this.amplifyService.auth().signIn(username, password)
            .then(user => {
                this.awsUser = user;
                this.amplifyService.auth().getPreferredMFA(user).then((data) => {
                    console.log('Current prefered MFA type is: ' + data);
                    this.currentMfaType = data;
                });
                if (user.attributes['custom:userRole'] === 'admin') {
                    this.amplifyService.auth().setPreferredMFA(user, 'TOTP').then((data) => {
                        console.log(data);
                        this.router.navigate(['pages/auth/totp']);
                        this.snackBar.open('Please authenticate with MFA', 'close', {
                            duration: 2000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition
                        });
                    }).catch(e => { console.log(e); });
                } else {
                    this.amplifyService.auth().setPreferredMFA(user, 'NOMFA').then((data) => {
                        this.router.navigate(['pages/auth/challenge']);


                    }).catch();

                }
            })
            .catch(err => console.log(err));




    }

    sendChallenge(challengeResponse: string): void {
        this.amplifyService.auth().configure({
            authenticationFlowType: 'CUSTOM_AUTH'
        });
        this.amplifyService.auth().sendCustomChallengeAnswer(this.awsUser, challengeResponse)
            // tslint:disable-next-line:no-shadowed-variable
            .then(user => console.log(user))
            .catch(err => console.log(err));

    }
}
