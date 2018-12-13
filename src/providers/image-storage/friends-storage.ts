import { Injectable } from '@angular/core';
import { ImageStorageProvider } from '../image-storage/image-storage';
import firebase from 'firebase';

/*
  LocalStorageProvider saves images locally for pass-Around mode
*/
@Injectable()
export class FriendsStorageProvider {
  groupNumber: string;
  sectionNumber: number;
  databaseRef = firebase.database().ref();
  storageRef = firebase.storage().ref();

  constructor(group){
    this.assignGroup(group);
  }

  /*
    assigns the group and section number based on what group the user clicked on the
    friends page
  */
  assignGroup(group){
    var self = this;
    if(group == "new"){
      this.groupNumber = null;
      this.sectionNumber = 0;
      return new Promise(function(resolve, reject) { resolve(null) } );
    } else {
      this.groupNumber = group;
      return this.databaseRef.child("groups").child(group).once('value', function(snapshot) {
        self.sectionNumber = snapshot.val() % 10;
        // set to currDrawings so other users can't also try to draw
        self.databaseRef.child("groups").child(group).set("currDrawing");
      });
    }
  }

  getOverlap(){
    return ImageStorageProvider.getOverlap(this.groupNumber, this.sectionNumber);
  }

  /*
    When the drawing is complete, update Firebase for the group and user
  */
  updateGroup(imgUrl){
    var promise;

    // if no group has been made yet (this was first drawing) wait until friends added to push

    // if this was the 2nd drawing increment its section number, update database
    if (this.sectionNumber == 1) {
      this.setDatabase(this.sectionNumber + 11);
      promise = this.storeImage(imgUrl);
    }
    // if this was the last drawing, update group status that 0 people have deleted it, update database
    else if (this.sectionNumber == 2) {
      this.setDatabase(0);
      promise = this.storeImage(imgUrl);
    } else {
      promise = new Promise(function(resolve, reject){resolve(true)});
    }
    return promise;
  }

  /*
    Once drawing is complete, set groupValue of group, move from user's invited
    list to user's completed lsit
  */
  setDatabase(groupValue){
    this.databaseRef.child("groups").child(this.groupNumber).set(groupValue);

    var userID = firebase.auth().currentUser.uid;
    this.databaseRef.child("users").child(userID).child("completed").child(this.groupNumber).set(this.sectionNumber);
    this.databaseRef.child("users").child(userID).child("invited").child(this.groupNumber).remove();
  }

  storeImage(imgUrl){
    if(this.sectionNumber != 0){
      return ImageStorageProvider.storeImage(imgUrl, this.groupNumber, this.sectionNumber);
    }
    else {
      return new Promise(function(resolve, reject) { resolve(null) } );
    }
  }

  /*
    create a group and add the users in invited[] to join it
  */
  createGroup(imgUrl, invited, currUserName){
    var self = this;
    var userID = firebase.auth().currentUser.uid;
    var user1 = invited[0];
    var user2 = invited[1];

    this.databaseRef.child("groups").push(this.sectionNumber + 11).then((ref) => {
       self.groupNumber = ref.getKey();
       self.databaseRef.child("users").child(userID).child("completed").child(ref.getKey()).set(this.sectionNumber);
       ImageStorageProvider.storeImage(imgUrl, this.groupNumber, this.sectionNumber);
       self.inviteUser(user1['userID'], currUserName, user2['username']);
       self.inviteUser(user2['userID'], currUserName, user1['username']);
     });
  }

  /*
    invite a user to join the doodle
  */
  inviteUser(userID, currUserEmail, otherUser){
    this.databaseRef.child("users").child(userID).child("invited").child(this.groupNumber).set(currUserEmail + " and " + otherUser);
  }

  /*
    returns the image urls that are in the specificed group folder in firebase
   */
  getImageUrls(){
      return ImageStorageProvider.getImageUrls(this.groupNumber);
  }

  cancelDrawing(){
    if(this.sectionNumber != 0){
      this.databaseRef.child("groups").child(this.groupNumber).set(this.sectionNumber + 10);
    }
  }

}
