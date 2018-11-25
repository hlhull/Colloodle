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
      });
    }
  }

  getOverlap(){
    return ImageStorageProvider.getOverlap(this.groupNumber, this.sectionNumber);
  }

  updateGroup(){
    var promise;
    var userID = firebase.auth().currentUser.uid;
    // if no group has been made yet (this was first drawing) --> push to Firebase,
    // assign groupNumber as the uid of that push
    if(this.sectionNumber == 0) {
      var self = this;
      promise = this.databaseRef.child("groups").push(this.sectionNumber + 11).then((ref) => {
        self.groupNumber = ref.getKey();
        self.databaseRef.child("users").child(userID).child("completed").child(ref.getKey()).set(this.sectionNumber);
      });
      // add to the invited path of 2 other users
    }
    // if this was the 2nd drawing increment its section number, add to user's completed, and remove from invited
    else if (this.sectionNumber == 1) {
      this.databaseRef.child("groups").child(this.groupNumber).set(this.sectionNumber + 11);
      this.databaseRef.child("users").child(userID).child("completed").child(this.groupNumber).set(this.sectionNumber);
      this.databaseRef.child("users").child(userID).child("invited").child(this.groupNumber).remove();
      promise = new Promise(function(resolve, reject) {resolve(true)});
    }
    // if this was the last drawing, update group status that 0 people have deleted it
    // move from user's invited list to completed list
    else if (this.sectionNumber == 2) {
      this.databaseRef.child("groups").child(this.groupNumber).set(0);
      this.databaseRef.child("users").child(userID).child("completed").child(this.groupNumber).set(this.sectionNumber);
      this.databaseRef.child("users").child(userID).child("invited").child(this.groupNumber).remove();
      promise = new Promise(function(resolve, reject){resolve(true)});
    }
    return promise;
  }

  storeImage(imgUrl){
    return ImageStorageProvider.storeImage(imgUrl, this.groupNumber, this.sectionNumber);
  }

  /*
    returns the image urls that are in the specificed group folder in firebase
   */
  getImageUrls(){
      return ImageStorageProvider.getImageUrls(this.groupNumber);
  }

  cancelDrawing(){
    return null;
  }

}
