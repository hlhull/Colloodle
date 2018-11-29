import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
// import { HomePage } from '../home/home.page'; //replaced this with the line below
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LoginPage } from '../login/login';

@Component({
	selector: 'page-reset-password',
	templateUrl: './reset-password.html'
})
export class ResetPasswordPage {
	ResetPasswordError: string;
	form: FormGroup;

	constructor(
		fb: FormBuilder,
		private navCtrl: NavController,
    private auth: AuthService,
		private screenOrientation: ScreenOrientation
	) {
		this.form = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])]
		});

		this.screenOrientation.unlock();
  }

	// /*
	// * Signs the user up with the given email and password, sending info to firebase
	// *
	// * Then sends the user to the home page
	// */
  // ResetPassword() {
		// let data = this.form.value;
		// let credentials = {
		// 	email: data.email,
		// 	password: data.password
		// };
		// this.auth.signUp(credentials).then(
		// 	() => this.navCtrl.setRoot(HomePage),
		// 	error => this.signupError = error.message
		// );
  // }

  // TODO: figure out how to check if the email is one of our users! if not, return and have an error message of some sort

  /*
  * if the email entered is an email, reset the password
  */
  resetPassword() {
    let data = this.form.value;

		if (!data.email) {
  		return;
  	}

    this.auth.resetPassword(data.email);
  }

	/*
  * sends user to home page
  */
  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  /*
  * sends user back to login page
  */
  goBackToLogin(): void {
    this.navCtrl.setRoot(LoginPage);
  }

  // TODO:
  // add popup when error occurs/catch errors better (in auth service)
  // add popup when reset password button is clicked, tell user email was sent
  // check that user is actually a user?

}
