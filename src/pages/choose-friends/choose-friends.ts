import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { ImageStorageProvider } from '../../providers/image-storage/image-storage';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the ChooseFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-friends',
  templateUrl: 'choose-friends.html',
})
export class ChooseFriendsPage {
  @ViewChild('mySearchbar') searchbar: Searchbar;

  databaseRef = firebase.database().ref();
  currUserName: String;
  numInvited = 0;
  imgUrl: String;
  matches = [];
  invites = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public imageStorage: ImageStorageProvider, private alertCtrl: AlertController) {
    this.imageStorage = navParams.get('imageStorage');
    this.imgUrl = navParams.get('imgUrl');

    // get current user's username
    var self = this;
    if(firebase.auth().currentUser != null){
      var id = firebase.auth().currentUser.uid;
      this.currUserName = firebase.auth().currentUser.displayName;
    }

  }

  // on input, check if input is a user's email; invite them if so
  onInput(searchbar){
    if (searchbar != null){
      var username = searchbar.srcElement.value;
      var self = this;

      this.databaseRef.child("userList").once('value', function(snapshot) {
        snapshot.forEach(function(userSnapshot) {
          var invitedUID = userSnapshot.val();
          var inviteUsername = userSnapshot.key;
          if(inviteUsername == username && inviteUsername != self.currUserName){ //don't let user invite themselves
            if(self.invites.length > 0) {
              if (inviteUsername != self.invites[0]['username']){ // don't let user invite other user 2x
                self.matches.push({"username": username, "userID": invitedUID});
              }
            } else {
              self.matches.push({"username": username, "userID": invitedUID});
            }
          }
        });
      });
    }
  }

  // invite up to 2 other users, then go to home page
  inviteUser(matchInfo){
    this.invites.push(matchInfo);
    this.matches = [];
    this.searchbar.clearInput(null);
    this.numInvited += 1;

    if (this.numInvited > 1){
      this.imageStorage.createGroup(this.imgUrl, this.invites, this.currUserName);
      this.presentInfo();
    }
  }

  onCancel(event){
    this.matches = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseFriendsPage');
  }

  presentInfo() {
    let alert = this.alertCtrl.create({
      title: 'Drawing',
      message: "Your friends have been invited to the drawing. You'll be notified when the drawing is complete!",
      buttons: [
        {
          text: 'Done',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

  goHome(): void {
    this.presentConfirmGoHome();
  }

  /*
  * Causes an alert/confirmation screen to pop up when home button is pressed
  */
  presentConfirmGoHome() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Action',
      message: 'Are you sure you want to leave and go to the Home page? Your drawing will be lost.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            // this.imageStorage.cancelDrawing();
            this.navCtrl.setRoot(HomePage);
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

}
