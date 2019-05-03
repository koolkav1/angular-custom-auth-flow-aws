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

export class CustomAuthService {

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
            this.amplifyService.auth().configure({
                authenticationFlowType: 'CUSTOM_AUTH'
            });
    }

    storeUserName(username: string): void {
        this.awsUserName = username;
    }

    public login(username: string, password: string): void {
        console.log('login method activated');
        this.amplifyService.auth().signIn(username, password)
        .then(user => {
            console.log('user returned: ' + user);
            this.awsUser = user;
            if (user.challengeName === 'CUSTOM_CHALLENGE') {
                console.log('redirecting you');
                this.router.navigate(['pages/auth/challenge']);
            }
           else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                console.log('Password Change required');
                this.router.navigate(['pages/auth/reset-password']);
            }
            else {
                console.log('you have logged in');
                this.router.navigate(['/']);
            }
        })
        .catch(err => console.log(err));

    }
    public changePassword(email: string, newPassword: string): void {
        this.amplifyService.auth().completeNewPassword(this.awsUser, newPassword,
            {
                email: email
              })
        .then(user => {
            if (user.challengeName === 'CUSTOM_CHALLENGE') {
                console.log('redirecting you to complete challenge');
                this.router.navigate(['pages/auth/challenge']);
            }
        })
        .catch(err => console.log(err));
    }



    sendChallenge(challengeResponse: string): void {
        this.amplifyService.auth().sendCustomChallengeAnswer(this.awsUser, challengeResponse)
            // tslint:disable-next-line:no-shadowed-variable
            .then(user => console.log(user))
            .catch(err => console.log(err));

    }
}
