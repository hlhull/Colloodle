// Made with help from tutorial:
// https://medium.com/appseed-io/integrating-firebase-password-and-google-authentication-into-your-ionic-3-app-2421cee32db9

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, IonicPage } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';
import { SignupPage } from '../signup/signup';
import { AngularFireAuth } from 'angularfire2/auth';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ResetPasswordPage } from '../reset-password/reset-password';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	loginForm: FormGroup;
	loginError: string;

	constructor(
		private navCtrl: NavController,
		private auth: AuthService,
		fb: FormBuilder,
    private screenOrientation: ScreenOrientation
	) {
		this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});

    this.screenOrientation.unlock();
	}

/*
* handles the login process, returns if an email is not entered, returns error if
* the credentials don't work
*/
login() {
		let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signInWithEmail(credentials)
			.then(
				() => this.navCtrl.setRoot(HomePage),
				error => this.loginError = error.message
			);
	}

  /*
  * sends you to the signup page
  */
  signup() {
    this.navCtrl.push(SignupPage);
  }

  /*
  * go to reset password page
  */
  goResetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }


  /*
  * sends user back to home page
  */
  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

}
