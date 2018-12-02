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
import { AlertController } from 'ionic-angular';

@Component({
	selector: 'as-page-signup',
	templateUrl: './signup.html'
})
export class SignupPage {
	signupError: string;
	form: FormGroup;
  databaseRef = firebase.database().ref();

	constructor(fb: FormBuilder, private navCtrl: NavController, private auth: AuthService, private screenOrientation: ScreenOrientation, private alertCtrl: AlertController) {
		this.form = fb.group({
			username: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-Z0-9]*')])],
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});

		this.screenOrientation.unlock();
  }

	/*
	* Signs the user up with the given email and password if their username is unqiue,
	* sending info to firebase
	*
	* Adds username to user's profile and database userList, then sends the user to the home page
	*/
  signup() {
		let data = this.form.value;
		let credentials = {
			email: data.email,
			password: data.password
		};
		var username = data.username;

		var self = this;
		this.databaseRef.child("userList").once('value', function(snapshot) {
			if(snapshot.hasChild(username)){
				self.presentNewUsername();
			} else {
				self.auth.signUp(credentials).then(() => {
						var userID = firebase.auth().currentUser.uid;
						firebase.auth().currentUser.updateProfile({ //add username to user's profile
  						displayName: username,
							photoURL: null
						}).then(() => {
			 				self.navCtrl.setRoot(HomePage)
						});
						self.databaseRef.child("userList").child(username).set(userID); // add username to userList
					},
					error => this.signupError = error.message
				);
			}
		});
  }

	/*
  * sends user back to home page
  */
  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

	/*
		Let user know that username is already taken
	*/
	presentNewUsername(){
		let alert = this.alertCtrl.create({
			title: 'Username Taken',
			message: 'Please choose a new username',
			buttons: [
				{
					text: 'Ok',
					role: 'cancel',
					handler: () => {}
				}
			]
		});
		alert.present();
	}

}
