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
        self.databaseRef.child("groups").child(group).set("currDrawing");
      });
    }
  }

  getOverlap(){
    return ImageStorageProvider.getOverlap(this.groupNumber, this.sectionNumber);
  }

  updateGroup(imgUrl){
    var promise;
    var userID = firebase.auth().currentUser.uid;
    // if no group has been made yet (this was first drawing) wait until friends added to push

    // if this was the 2nd drawing increment its section number, add to user's completed, and remove from invited
    if (this.sectionNumber == 1) {
      this.databaseRef.child("groups").child(this.groupNumber).set(this.sectionNumber + 11);
      this.databaseRef.child("users").child(userID).child("completed").child(this.groupNumber).set(this.sectionNumber);
      this.databaseRef.child("users").child(userID).child("invited").child(this.groupNumber).remove();
      promise = this.storeImage(imgUrl);
      //promise = new Promise(function(resolve, reject) {resolve(true)});
    }
    // if this was the last drawing, update group status that 0 people have deleted it
    // move from user's invited list to completed list
    else if (this.sectionNumber == 2) {
      this.databaseRef.child("groups").child(this.groupNumber).set(0);
      this.databaseRef.child("users").child(userID).child("completed").child(this.groupNumber).set(this.sectionNumber);
      this.databaseRef.child("users").child(userID).child("invited").child(this.groupNumber).remove();
      promise = this.storeImage(imgUrl);
      //promise = new Promise(function(resolve, reject){resolve(true)});
    } else {
      promise = new Promise(function(resolve, reject){resolve(true)});
    }
    return promise; //new Promise(function(resolve, reject){resolve(true)});
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

    this.databaseRef.child("groups").push(this.sectionNumber + 11).then((ref) => {
       self.groupNumber = ref.getKey();
       self.databaseRef.child("users").child(userID).child("completed").child(ref.getKey()).set(this.sectionNumber);
       ImageStorageProvider.storeImage(imgUrl, this.groupNumber, this.sectionNumber);
       for (var i in invited){
         self.inviteUser(invited[i]['userID'], currUserName);
       }
     });
  }

  /*
    invite a user to join the doodle
  */
  inviteUser(userID, currUserEmail){
    this.databaseRef.child("users").child(userID).child("invited").child(this.groupNumber).set(currUserEmail);
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
