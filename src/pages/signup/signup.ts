// Made with help from tutorial:
// https://medium.com/appseed-io/integrating-firebase-password-and-google-authentication-into-your-ionic-3-app-2421cee32db9

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
// import { HomePage } from '../home/home.page'; //replaced this with the line below
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import firebase from 'firebase';

@Component({
	selector: 'as-page-signup',
	templateUrl: './signup.html'
})
export class SignupPage {
	signupError: string;
	form: FormGroup;

	constructor(
		fb: FormBuilder,
		private navCtrl: NavController,
    private auth: AuthService,
		private screenOrientation: ScreenOrientation
	) {
		this.form = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});

		this.screenOrientation.lock("portrait");
  }

	/*
	* Signs the user up with the given email and password, sending info to firebase
	*
	* Adds user to database userList, then sends the user to the home page
	*/
  signup() {
		let data = this.form.value;
		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signUp(credentials).then(
			() => { var userID = firebase.auth().currentUser.uid;
							firebase.database().ref().child("userList").child(userID).set(credentials['email']);
				 			this.navCtrl.setRoot(HomePage)},
			error => this.signupError = error.message
		);
  }

	/*
  * sends user back to home page
  */
  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

}
