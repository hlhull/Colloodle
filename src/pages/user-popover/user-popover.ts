import { ViewController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';


/*
  Class for the color-popover menu.

  Menu on DrawingPage that allows user to change brush options, using BrushProvider
*/
@Component({
  template: `
    <ion-list>
      <ion-item>
        <button ion-button clear (click)="this.logout()">
            <ion-icon name="log-out"></ion-icon>
            Logout
        </button>
        <button icon-only ion-button (click)="this.close()" item-right color="dark" clear>
          <ion-icon name="close" align="right"></ion-icon>
        </button>
      </ion-item>
      <ion-item>
        <button ion-button clear (click)="this.presentConfirmResetPassword()">
          Reset Password
        </button>
      </ion-item>
    </ion-list>
  `
})

export class UserPopoverPage {
  constructor(public viewCtrl: ViewController, private auth: AuthService, private alertCtrl: AlertController) {}

  close() {
    this.viewCtrl.dismiss();
  }

  /*
  * signs you out; this automatically removes the logout button and user/email
  * header on the home page, since the html checks if you are logged in or not
  */
  logout() {
    this.auth.signOut();
    this.close();
  }

  presentConfirmResetPassword() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Action',
      message: 'Are you sure you want to reset your password? If yes, tap yes and follow the directions sent to the email associated with this account.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.resetPassword();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

  /*
  * reset the password for the current user
  */
  resetPassword() {
    let email = this.auth.getEmail();

    this.auth.resetPassword(email);

    this.close();
  }
}
