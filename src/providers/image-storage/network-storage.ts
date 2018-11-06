import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Interacts with Firebase for Random mode to save / get pictures
*/
@Injectable()
export class NetworkStorageProvider {
  groupNumber: string;
  sectionNumber: number;
  doneUploading: any;
  databaseRef = firebase.database().ref();
  nextListRef = this.databaseRef.child("inProgress").child("next");

  constructor() {
    // this.groupNumber = "group#";     //use these 2 lines for testing, comment out the "assignGroup()" line to make it actually run
    // this.sectionNumber = 2;

    this.assignGroup();

  }

  /*
    Assigns group # and section # user will be working on by getting first element
    in the inProgress:next list; if there is none in inProgress:next, work on 0th section
  */
  assignGroup(){
    var self = this;
    this.databaseRef.child("inProgress").once('value', function(snapshot){
      if(!snapshot.hasChild("next")){ //if there's no group in next, will make group once user submits pic
        self.groupNumber = null;
        self.sectionNumber = 0;
      } else {
        var userID = firebase.auth().currentUser.uid;
        //if there is a next group, check that the user isn't already in it, remove it from next, set group / section number
        self.nextListRef.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              self.databaseRef.child("users").child(userID).child(childSnapshot.key).once('value', function(userSnapshot){
                if(!userSnapshot.exists()){
                  self.groupNumber = childSnapshot.key;
                  self.sectionNumber = childSnapshot.val();
                  self.nextListRef.child(self.groupNumber).remove();
                  return null;
                }
            }).then(() => {
              if(self.groupNumber == undefined){
                self.groupNumber = null;
                self.sectionNumber = 0;
              }
            });
        })})}});
  }

  /*
    Returns the previous image in the group, or null if this is the first image
  */
  getOverlap(){
    if(this.sectionNumber > 0){
      var storageRef = firebase.storage().ref().child(this.groupNumber); //which folder we want to get images from
      var imageRef = storageRef.child(this.sectionNumber - 1 + '.png'); // references previous image
      return imageRef.getDownloadURL();
    }
    return null;
  }

  /*
    store image with given dataUrl in Firebase at group/sectionNum.png
   */
  storeImage(imgUrl){
      //var done = this.updateGroup(imgUrl);

       var blob = this.dataUrlToBlob(imgUrl);

      // Create root reference
      var storageRef = firebase.storage().ref();

      // Put the image in the correct group folder
      var groupRef = storageRef.child(this.groupNumber + '/' + this.sectionNumber + '.png');

      //upload to firebase
      return groupRef.put(blob);
  }

  /*
    removes group from pending, puts group into either next or completed
    creates group if this was first drawing in group
  */
  updateGroup(){
    var promise;
    var userID = firebase.auth().currentUser.uid;
    // if no group has been made yet (this was first drawing) --> push to Firebase,
    // assign groupNumber as the uid of that push
    if(this.sectionNumber == 0) {
      var self = this;
      promise = this.nextListRef.push(1).then((ref) => {
        self.groupNumber = ref.getKey();
        self.databaseRef.child("groups").child(ref.getKey()).set("drawing");
        self.databaseRef.child("users").child(userID).child(ref.getKey()).set(1);
      });
      //this.databaseRef.child("groups").child()
    }
    // if this was the 2nd drawing put group back into next list
    else if (this.sectionNumber == 1) {
      this.nextListRef.child(this.groupNumber).set(2);
      this.databaseRef.child("users").child(userID).child(this.groupNumber).set(1);
      promise = new Promise(function(resolve, reject) {resolve(true)});
    }
    // if this was the last drawing, update group status that 1 person has seen it
    else if (this.sectionNumber == 2) {
      this.databaseRef.child("groups").child(this.groupNumber).set(1);
      promise = new Promise(function(resolve, reject){resolve(true)});
    }


    return promise;
  }

  /*
    gets the image urls that are in the specificed group folder in firebase
   */
  getImageUrls(){
      var storageRef = firebase.storage().ref().child(this.groupNumber); //which folder we want to get images from

      var imageRef0 = storageRef.child(0 + '.png'); // references image 0.png
      var imageRef1 = storageRef.child(1 + '.png'); // references image 1.png
      var imageRef2 = storageRef.child(2 + '.png'); // references image 2.png

      // return an array of the image urls of all the images in the folder
      return Promise.all([imageRef0.getDownloadURL(), imageRef1.getDownloadURL(), imageRef2.getDownloadURL()]);
  }

  /*
    if a user leaves the drawing without clicking finish, move the group back to next
  */
  cancelDrawing(){
    if (this.sectionNumber != 0){ //if it's section 0 we haven't created the group yet -> no action needed
      this.nextListRef.child(this.groupNumber).set(this.sectionNumber);
    }
  }

  /* convert base64/URLEncoded data component to raw binary data held in a string
     from: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158#5100158
  */
  dataUrlToBlob(dataUrl){
      var byteString;
      if (dataUrl.split(',')[0].indexOf('base64') >= 0){
          byteString = atob(dataUrl.split(',')[1]);
      }

      // separate out the mime component
      var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {type:mimeString});
  }
}
