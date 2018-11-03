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
    //this.nextListRef.push("1");

    this.groupNumber = "group#";     //use these 2 lines for testing, comment out the "assignGroup()" line to make it actually run
    this.sectionNumber = 2;

    // this.assignGroup();
  }

  /*
    Assigns group # and section # user will be working on by getting first element
    in the inProgress:next list; if there is none in inProgress:next, work on 0th section
  */
  assignGroup(){
    // if there's no next group, group# and section# will be set to null --> will actually
    // create group once the user completes their picture, so we
    // don't create a group, have user exit w/o submitting image, and then have empty group
    this.databaseRef.child("inProgress").once('value', function(snapshot){
      if(!snapshot.hasChild("next")){
        this.groupNumber = null;
        this.sectionNumber = 0;
        console.log(this.groupNumber, this.sectionNumber);
      }
    }.bind(this));

    //if there is a next group, remove it from next, set group / section number, and move group to pending
    this.nextListRef.limitToFirst(1).once("child_added", function(snapshot) {
        this.groupNumber = snapshot.key;
        this.sectionNumber = snapshot.val();
        this.nextListRef.child(this.groupNumber).remove();
        firebase.database().ref().child("inProgress").child("pending").child(this.groupNumber).set(this.sectionNumber);
        console.log(this.groupNumber, this.sectionNumber);
      }.bind(this))
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
      console.log(this.groupNumber);
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
    // if no group has been made yet (this was first drawing) --> push to Firebase,
    // assign groupNumber as the uid of that push
    var promise;
    if(this.sectionNumber == 0){
      console.log(this.groupNumber, this.sectionNumber);
      var self = this; //self.sectionNumber + 1
      promise = this.nextListRef.push(1).then((ref) => self.groupNumber = ref.getKey());
    } else {
      promise = new Promise(function(resolve, reject){resolve(true)});
    }


    // if(this.sectionNumber == 0){ // if this was the first drawing, create group and move to next

    // } else if (this.sectionNumber == 1){ //if this was the 2nd drawing, move back to next queue
    //   //this.moveGrouptoNext();
    // } else if (this.sectionNumber == 2){ //if this was the last drawing, group is completed
    //   //this.moveGrouptoCompleted();
    // }
    // return new Promise(function(resolve, reject) {resolve(self.groupNumber)});
    return promise;
  }

  createGroup(){

  }

  /*
    gets the image urls that are in the specificed group folder in firebase
   */
  getImageUrls(){
      console.log(this.groupNumber);
      var storageRef = firebase.storage().ref().child(this.groupNumber); //which folder we want to get images from

      var imageRef0 = storageRef.child(0 + '.png'); // references image 0.png
      var imageRef1 = storageRef.child(1 + '.png'); // references image 1.png
      var imageRef2 = storageRef.child(2 + '.png'); // references image 2.png

      // return an array of the image urls of all the images in the folder
      return Promise.all([imageRef0.getDownloadURL(), imageRef1.getDownloadURL(), imageRef2.getDownloadURL()]);
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
