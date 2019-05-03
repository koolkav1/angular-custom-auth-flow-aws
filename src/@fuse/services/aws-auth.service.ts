import { Injectable } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import {  Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition, } from '@angular/material';


@Injectable({
  providedIn: 'root'
})

export class AwsAuthService {

  awsConfirm: any;
  code: any;
  awsUserName: string;
  currentUser: Observable<any>;
  signedIn: any;
  currentUserSnapshot: any;
  forgotPasswordUsername: string;
  totpCode: string;
  userForTotp: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private amplifyService: AmplifyService,
    public snackBar: MatSnackBar, 
    private router: Router) {
   }
   signUpNewUser(userDetails: UserDetails): void{
     console.log('Sign up new user');
    this.amplifyService.auth().signUp(userDetails)
    .then(data => {
      console.log(data);
      this.awsConfirm = data;
      if (this.awsConfirm) {
        console.log('confirm the signup');
        this.snackBar.open('Please confirm your email address', 'close', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
        const username = this.awsConfirm.user.username;
        this.storeUserName(username);
        this.router.navigate(['pages/auth/confirm']);
      }
    })
    .catch(err => console.log(err));
   }
   confirmSignUp(code): void{
     this.amplifyService.auth().confirmSignUp(this.awsUserName, code, { forceAliasCreation: true})
     .then(data => {
      console.log(data);
      this.snackBar.open('Sign Up success, please log in', 'close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
      this.router.navigate(['pages/auth/login']);
      
     })
     .catch(err => console.log(err));
   }

  async  signOut(): Promise<void>  {
    try {
      await  this.amplifyService.auth().signOut({global: true});
      await  this.snackBar.open('You have been signed out', 'close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
    } catch (error) {
      console.log(error);
    }
   }
   storeUserName(username: string): void {
     this.awsUserName = username;
   }
  // async  retrieveCurrentUser(): Promise<void> {
  //   try {
  //    const user = await this.amplifyService.auth().currentAuthenticatedUser();
  //    console.log(user);
  //    return  this.currentUser = user;
     
  //   } catch (error) {
  //     console.log(error);
  //   }
  //  }
   firstTimeIsUserLoggedIn(): boolean {
    this.amplifyService.authStateChange$.subscribe(authState => {
      this.signedIn = authState;
      if (!authState.user) {
        console.log('user does not exist');
        return false;
      } else {
        console.log(authState);
        this.userForTotp = authState.user;
        this.awsUserName = authState.user.username;
        console.log('Yay user exists');
        this.generateTOTP(this.userForTotp);
        return true;
      }
    });
    return false;
   }
   // MFA v2
   isUserLoggedIn(): boolean {
    this.amplifyService.authStateChange$.subscribe(authState => {
      this.signedIn = authState;
      if (!authState.user) {
        console.log('user does not exist');
        return false;
      } else {
        console.log(authState);
        this.userForTotp = authState.user;
        this.awsUserName = authState.user.username;
        console.log('Yay user exists');
        return true;
      }
    });
    return false;
   }

   firstTimeLogInUser(username: string, password: string): void  {
    this.awsUserName = username;
    const makeRequest = async () => {
      try {
        await this.amplifyService.auth().signIn(username, password);
        console.log('Signin sucess');
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
    this.snackBar.open('Please authenticate with MFA', 'close', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
    this.router.navigate(['pages/auth/totp']);
    
   }
   // Login V2
   logInUser(username: string, password: string): void  {
    this.awsUserName = username;
    const makeRequest = async () => {
      try {
        await this.amplifyService.auth().signIn(username, password);
        console.log('Signin sucess');
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
    this.snackBar.open('Please authenticate with MFA', 'close', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
    this.router.navigate(['pages/auth/mfa']);
    
   }
  async changePassword(oldPassword: string, newPassword: string): Promise<void>   {
     try {
       this.amplifyService.auth().changePassword(this.currentUserSnapshot, oldPassword, newPassword );
     } catch (error) {
       console.log(error);
     }
   }
   async forgotPassword (username): Promise<void>   {
     try {
       console.log('reaching out to forgot password service');
       await  this.amplifyService.auth().forgotPassword(username);
       this.forgotPasswordUsername = username;
     } catch (error) {
       console.log('error');
     }
   }
   async forgotPasswordSubmit(code, newPassword): Promise<void>   {
     try {
       await this.amplifyService.auth().forgotPasswordSubmit(this.forgotPasswordUsername, code, newPassword);
     } catch (error) {
       console.log(`Username does not exisit: ${error}`);
     }
   }

   generateTOTP(user): string {
    this.amplifyService.auth().setupTOTP(user)
    .then(code => {
      console.log(code);
      this.totpCode = code;
      this.snackBar.open('Token has been generated', 'close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
      return this.totpCode;
    })
    .catch(err => {
      
      console.log(err);
    });
    return this.totpCode;
  }
  signInWithTOTP(challengeAnswer): void {
    console.log(challengeAnswer);
    console.log(this.userForTotp);
    this.amplifyService.auth().verifyTotpToken(this.userForTotp, challengeAnswer)
    .then((data) => {
      console.log(data);
      this.amplifyService.auth().setPreferredMFA(this.userForTotp, 'TOTP');
      this.signedIn = this.amplifyService.auth().currentAuthenticatedUser();
      console.log('yay -soiemthing');
      if (data) {
      // sign in success, query params?
      this.snackBar.open('Yay you have been signed in', 'close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
      this.router.navigate(['/']);
      }
    })
    .catch(err => console.log(err));

  }
  
}
export interface UserDetails {
  username: string;
  password: string;
  attributes?: {
    email?: string;
  phone_number?: string;
  };
}
