import { Injectable } from '@angular/core';
import { ImageStorageProvider } from '../image-storage/image-storage';
import firebase from 'firebase';

/*
  LocalStorageProvider saves images locally for pass-Around mode
*/
@Injectable()
export class PassAroundStorageProvider {
  storedImageUrls = [];
  sectionNumber;
  groupNumber;
  databaseRef = firebase.database().ref();
  storageRef = firebase.storage().ref();

  constructor() {
    this.sectionNumber = 0;
  }

  setUp(group, section) {}

  /*
   * store image with given image url in the array
   */
  storeImage(imgUrl) {
      //store image in storedImages
      this.storedImageUrls[this.sectionNumber] = imgUrl;
      this.sectionNumber = this.sectionNumber + 1;

      //if we have 3 pictures
      if(this.sectionNumber == 3){
        if(firebase.auth().currentUser != null){
          this.uploadImages();
        }
        return true;
        //return new Promise(function(resolve, reject) { resolve(true) } );
      }
      return false;
      //return new Promise(function(resolve, reject) { resolve(false) } );
  }

  /*
   * gets the image urls
   */
  getImageUrls() {
    var urls = this.storedImageUrls;
    return new Promise(function(resolve, reject) { resolve(urls); });
  }

  getOverlap() {
    if (this.sectionNumber > 0){
      var overlap =  this.storedImageUrls[this.sectionNumber - 1];
      return new Promise(function(resolve, reject) { resolve(overlap); });
    }
    return null;
  }

  cancelDrawing() {
    return null;
  }

  /*
    Makes a new group in FB and uploads the images to that group
  */
  uploadImages(){
    var self = this;
    var userID = firebase.auth().currentUser.uid;

    this.databaseRef.child("users").child(userID).push(0).then((ref) => { // make new group
      self.groupNumber = ref.getKey();
      self.databaseRef.child("groups").child(ref.getKey()).set(2); // add group to groups list
      for (var i = 0; i < self.storedImageUrls.length; i++) { // store images in groups folder
        var blob = ImageStorageProvider.dataUrlToBlob(self.storedImageUrls[i]);
        var groupRef = this.storageRef.child(self.groupNumber + '/' + i + '.png');
        groupRef.put(blob)
      }
    });
  }

}
