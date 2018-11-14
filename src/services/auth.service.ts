/*
* Service for everything to do with authentication; import when this functionality is needed
*
* Includes: sign in,sign out, sign up, get if authenticated, get email, and reset passwordErrors
*
* The backend of this is supported by firebase, firebase does a lot of this for us
*
* Made with help from tutorial:
* https://medium.com/appseed-io/integrating-firebase-password-and-google-authentication-into-your-ionic-3-app-2421cee32db9
*/

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { GroupManagerProvider } from '../providers/group-manager/group-manager';
import * as firebase from 'firebase/app';
// import firebase from '../firebase';
import AuthProvider = firebase.auth.AuthProvider;

@Injectable()
export class AuthService {
	private user: firebase.User;

	constructor(public afAuth: AngularFireAuth, public groupManager: GroupManagerProvider) {
		afAuth.authState.subscribe(user => {
			this.user = user;
			this.groupManager.setUpManager(); //set up groupManager for the new user
		});
	}

	/*
	* Sign in with the given credentials
	*/
	signInWithEmail(credentials) {
		console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
	}

	/*
	* Sign out
	*/
	signOut(): Promise<void> {
		this.groupManager.reset();
    return this.afAuth.auth.signOut();
  }

  signUp(credentials) {
	   return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

	/*
	* Check if currently authenticated (logged in)
	*/
  get authenticated(): boolean {
    return this.user !== null;
  }

	/*
	* Get the email of current user (CHECK IF AUTHENTICATED, above, FIRST)
	*/
  getEmail() {
    return this.user && this.user.email;
  }

// TODO: refine resetPassword				(tasks listed in order of priority)
// - maybe send them to a new page instead of being lazy/quick and just checking
//   current user, make it more intuitive
// - handle errors if the email entered is invalid
// - make the email say Colloodle, instead of Project(some large number)
// - if we have time, check to see how firebase handles suspicious activity; I
//   know if I reset a password a bunch of times in one day it stops letting me
//   do this for some unknown period of time

	/*
	* sends email to the user allowing password reset (handled by firebase)
	*/
	resetPassword(email) {
    this.afAuth.auth.sendPasswordResetEmail(email)
			// .catch(function(error) {
			// 	// Handle Errors here.
			//   var errorCode = error.code;
			//   var errorMessage = error.message;
			//
			// 	if (errorCode == 'auth/invalid-email') {
    	// 		alert('Wrong password.');
			// 	} else {
			// 		alert('errorMessage');
			// 	}
			//
			// 	console.log(error);
			// })
	    .then(() => {
	      console.log('email sent');
	    });
  }

}
