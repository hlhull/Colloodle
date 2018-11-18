import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  ImageStorageProvider contains the methods needed in NetworkStorageProvider
  and LocalStorageProvider to save and retrieve image data
*/
@Injectable()
export class ImageStorageProvider {
  groupNumber: string;
  constructor() {}

  /*
   * store image with given image
   */
  storeImage(imgUrl){
    return new Promise(function(resolve, reject) { resolve(null) } );
  }

  /*
   * gets the image urls
   */
  getImageUrls(){
    return new Promise(function(resolve, reject) { resolve(null) } );
  }

  setUp(group, section){}

  /*
    convert base64/URLEncoded data component to raw binary data held in a string
     from: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158#5100158
  */
  static dataUrlToBlob(dataUrl){
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

  /*
    returns the image urls that are in the specificed group folder in firebase
   */
  static getImageUrls(groupNumber){
      var storageRef = firebase.storage().ref().child(groupNumber); //which folder we want to get images from

      var imageRef0 = storageRef.child(0 + '.png'); // references image 0.png
      var imageRef1 = storageRef.child(1 + '.png'); // references image 1.png
      var imageRef2 = storageRef.child(2 + '.png'); // references image 2.png

      // return an array of promises of the image urls of all the images in the folder
      return Promise.all([imageRef0.getDownloadURL(), imageRef1.getDownloadURL(), imageRef2.getDownloadURL()]);
  }

}
