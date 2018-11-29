import { Injectable } from '@angular/core';
import { ImageStorageProvider } from '../image-storage/image-storage';
import firebase from 'firebase';

/*
  Interacts with Firebase for Random mode to save / get pictures
*/
@Injectable()
export class RandomStorageProvider {
  groupNumber: string;
  sectionNumber: number;
  databaseRef = firebase.database().ref();
  storageRef = firebase.storage().ref();
  nextListRef = this.databaseRef.child("next");

  constructor() {}

  setGroupNum(groupNum){
    this.groupNumber = groupNum;
  }

  /*
    Assigns group # and section # user will be working on; returns a Promise
    that completes when assignment is complete
  */
  assignGroup(){
    // default if no next group is found (start new group)
    this.groupNumber = null;
    this.sectionNumber = 0;

    var self = this;
    var promises = [];
    var userID = firebase.auth().currentUser.uid;
    var set = false;

    // loop through next list to find group user hasn't been in yet
    // return promises that are resolved when group, section variables are set
    var nextListLoaded = this.nextListRef.once('value');
    return nextListLoaded.then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
          var promise = self.databaseRef.child("users").child(userID).child("completed").child(childSnapshot.key).once('value', function(userSnapshot){
            if(!userSnapshot.exists() && !set){
              self.groupNumber = childSnapshot.key;
              self.sectionNumber = childSnapshot.val();
              self.nextListRef.child(self.groupNumber).remove();
              set = true;
            }
          })
          promises.push(promise);
        });
        return Promise.all(promises);
    });
  }

  /*
    Returns the previous image in the group, or null if this is the first image
  */
  getOverlap(){
    return ImageStorageProvider.getOverlap(this.groupNumber, this.sectionNumber);
  }

  /*
    store image with given dataUrl in Firebase at group/sectionNum.png
    returns promise for when upload is complete
   */
  storeImage(imgUrl){
      return ImageStorageProvider.storeImage(imgUrl, this.groupNumber, this.sectionNumber);
  }

  /*
    after user's drawing is complete, updates group accordingly:
    creates group, puts group in next list, or updates group status as done
    returns promise for when new group has been created / updateGroup() is done
  */
  updateGroup(imgUrl){
    var promise;
    var userID = firebase.auth().currentUser.uid;
    // if no group has been made yet (this was first drawing) --> push to Firebase,
    // assign groupNumber as the uid of that push
    if(this.sectionNumber == 0) {
      var self = this;
      promise = this.nextListRef.push(this.sectionNumber + 1).then((ref) => {
        self.groupNumber = ref.getKey();
        self.databaseRef.child("groups").child(ref.getKey()).set("inProgress");
        self.databaseRef.child("users").child(userID).child("completed").child(ref.getKey()).set(this.sectionNumber);
        self.storeImage(imgUrl);
      });
    }
    // if this was the 2nd drawing put group back into next list
    else if (this.sectionNumber == 1) {
      this.nextListRef.child(this.groupNumber).set(this.sectionNumber + 1);
      this.databaseRef.child("users").child(userID).child("completed").child(this.groupNumber).set(this.sectionNumber);
      promise = this.storeImage(imgUrl); //new Promise(function(resolve, reject) {resolve(true)});
    }
    // if this was the last drawing, update group status that 1 person has seen it
    else if (this.sectionNumber == 2) {
      this.databaseRef.child("groups").child(this.groupNumber).set(0);
      this.databaseRef.child("users").child(userID).child("completed").child(this.groupNumber).set(this.sectionNumber);
      promise = this.storeImage(imgUrl);//new Promise(function(resolve, reject){resolve(true)});
    }
    return promise;
  }

  /*
    returns the image urls that are in the specificed group folder in firebase
   */
  getImageUrls(){
      return ImageStorageProvider.getImageUrls(this.groupNumber);
  }

  /*
    if a user leaves the drawing without clicking finish, move the group back to next
  */
  cancelDrawing(){
    if (this.sectionNumber != 0){ //if it's section 0 we haven't created the group yet -> no action needed
      this.nextListRef.child(this.groupNumber).set(this.sectionNumber);
    }
  }
}
