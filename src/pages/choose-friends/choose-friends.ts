import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImageStorageProvider } from '../../providers/image-storage/image-storage';
import { HomePage } from '../home/home';
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
  databaseRef = firebase.database().ref();
  currUserEmail: String;
  numInvited = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public imageStorage: ImageStorageProvider) {
    this.imageStorage = navParams.get('imageStorage');

    // get current user's email
    var self = this;
    if(firebase.auth().currentUser != null){
      var id = firebase.auth().currentUser.uid;
      this.databaseRef.child("userList").once('value', function(snapshot) {
        snapshot.forEach(function(userSnapshot) {
          if(userSnapshot.key == id){
            self.currUserEmail = userSnapshot.val();
          }
        });
      });
    }

  }

  // on input, check if input is a user's email; invite them if so
  onInput(searchbar){
    var email = searchbar.srcElement.value;
    var self = this;
    this.databaseRef.child("userList").once('value', function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var childKey = userSnapshot.key;
        if(userSnapshot.val() == email){
          self.inviteUser(userSnapshot.key);
        }
      });
    });
  }

  // invite up to 2 other users, then go to home page
  inviteUser(userUID){
    this.numInvited += 1;
    this.databaseRef.child("users").child(userUID).child("invited").child(this.imageStorage.groupNumber).set(this.currUserEmail);
    if (this.numInvited > 1){
      this.navCtrl.setRoot(HomePage);
    }
  }

  onCancel(event){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseFriendsPage');
  }

}
