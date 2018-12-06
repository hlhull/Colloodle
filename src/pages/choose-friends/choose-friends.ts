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
  currUserID: string;
  numInvited = 0;
  imgUrl: String;
  matches = [];
  friends = [];
  invites = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public imageStorage: ImageStorageProvider, private alertCtrl: AlertController) {
    this.imageStorage = navParams.get('imageStorage');
    this.imgUrl = navParams.get('imgUrl');

    // get current user's username
    if(firebase.auth().currentUser != null){
      this.currUserID = firebase.auth().currentUser.uid;
      this.currUserName = firebase.auth().currentUser.displayName;
    }

    //add friends as matches
    var self = this;
    this.databaseRef.child("users").child(this.currUserID).child("friends").once('value', function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        var id = userSnapshot.val();
        var username = userSnapshot.key;
        self.friends.push({"username": username, "userID": id, "invited": false});
        self.matches.push({"username": username, "userID": id, "invited": false});
      })
    });
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
          // don't let user invite themselves
          if(inviteUsername == username && inviteUsername != self.currUserName){
            var isUnique = true;
            //don't add to matches if it's already in matches
            for (var i = 0; i < self.matches.length; i++) {
              if(username == self.matches[i]['username']){
                isUnique = false;
                break;
              }
            }
            //don't add to matches if that user was already invited
            if(self.invites.length > 0 && self.invites[0]['username'] == username){
              isUnique = false;
            }
            if(isUnique){
              self.matches.push({"username": username, "userID": invitedUID, "invited": false});
            }
          }
        });
      });
    }
  }

  // invite up to 2 other users, then go to home page
  inviteUser(matchInfo){
    var found = false;
    //if the match was in friends, remove from friends list
    for (var i = 0; i < this.friends.length; i++) {
      if(!found && this.friends[i]['username'] == matchInfo['username']){
        found = true;
        this.friends.splice(i, 1);
      }
    }

    this.invites.push(matchInfo);
    this.matches = this.friends;
    this.searchbar.clearInput(null);
    this.numInvited += 1;

    //save this user as a friend of current user
    this.databaseRef.child("users").child(this.currUserID).child("friends").child(matchInfo['username']).set(matchInfo['userID']);

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

}
