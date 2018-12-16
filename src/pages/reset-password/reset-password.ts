import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from 'ionic-angular';
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
		private screenOrientation: ScreenOrientation,
		private alertCtrl: AlertController
	) {
		this.form = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])]
		});

		this.screenOrientation.unlock();
  }

  /*
  * if the email entered is an email, reset the password
  */
  resetPassword() {
    let data = this.form.value;

		if (!data.email) {
  		return;
  	}

    this.auth.resetPassword(data.email);

		this.presentResetPasswordPopup();
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

	presentResetPasswordPopup(){
    let alert = this.alertCtrl.create({
      title: 'Alert:',
      message: "If this email address is signed up with Colloodle, an email has been sent with directions to reset your password.",
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

}
