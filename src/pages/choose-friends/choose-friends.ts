import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { ImageStorageProvider } from '../../providers/image-storage/image-storage';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
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
  twoFriends = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public imageStorage: ImageStorageProvider, private screenOrientation: ScreenOrientation, private alertCtrl: AlertController) {
    this.imageStorage = navParams.get('imageStorage');
    this.imgUrl = navParams.get('imgUrl');
    this.screenOrientation.unlock();

    // get current user's username and ID
    if(firebase.auth().currentUser != null){
      this.currUserID = firebase.auth().currentUser.uid;
      this.currUserName = firebase.auth().currentUser.displayName;
    }

    //add friends as matches
    this.getFriends();
  }

  /*
    get user's friends from FB and add them to list of matches
  */
  getFriends(){
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

  /*
   on searchbar input, check if input is a user's email; add them to matches if so
  */
  onInput(searchbar){
    // check that searchbar isn't empty / not right after cancel was hit (sends MouseEvent)
    if (searchbar != null && !(searchbar instanceof MouseEvent)){
      var username = searchbar.srcElement.value.toLowerCase();
      var self = this;

      this.databaseRef.child("userList").once('value', function(snapshot) {
        snapshot.forEach(function(userSnapshot) {
          var matchUID = userSnapshot.val();
          var matchUsername = userSnapshot.key;
          // don't let user invite themselves
          if(matchUsername == username && matchUsername != self.currUserName){
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
              self.matches.push({"username": username, "userID": matchUID, "invited": false});
            }
          }
        });
      });
    }
  }

  /*
    move user from invited list to matched list
  */
  uninviteUser(friendInfo){
    //remove from invited list
    var found = false;

    //remove from invites list
    for (var i = 0; i < this.invites.length; i++) {
      if(!found && this.invites[i]['username'] == friendInfo['username']){
        found = true;
        this.invites.splice(i, 1);
      }
    }

    //add to matches list
    this.matches.push(friendInfo);
    this.numInvited -= 1;

    this.checkIfTwoInvited();
  }

  /*
    sees how many friends have been invited and updates twoFriends accordingly
  */
  checkIfTwoInvited(){
    if(this.numInvited == 2){
      this.twoFriends = true;
    } else {
      this.twoFriends = false;
    }
  }

  /*
    remove user from matched list, add to invited list and
    add user to the current user's friends in firebase;
  */
  inviteUser(matchInfo){
    if(this.numInvited < 2){
      var found = false;
      //remove from matches
      for (var i = 0; i < this.matches.length; i++) {
        if(!found && this.matches[i]['username'] == matchInfo['username']){
          found = true;
          this.matches.splice(i, 1);
        }
      }

      this.invites.push(matchInfo);
      this.searchbar.clearInput(null);
      this.numInvited += 1;

      this.checkIfTwoInvited()
    } else {
      // if there are already 2 users invited, don't allow more to be invited
      this.presentTwoUsers();
    }

    //save this user as a friend of current user
    this.databaseRef.child("users").child(this.currUserID).child("friends").child(matchInfo['username']).set(matchInfo['userID']);

  }

  /*
    When they hit submit, add the friends in invited to the drawing
  */
  addFriends(){
    this.imageStorage.createGroup(this.imgUrl, this.invites, this.currUserName);
    this.presentInfo();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseFriendsPage');
  }

  presentTwoUsers(){
    let alert = this.alertCtrl.create({
      title: 'Only Invite 2 Friends',
      message: "To invite another friend, remove one of the currently selected friends by tapping the minus sign.",
      buttons: [
        {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    alert.present();
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
