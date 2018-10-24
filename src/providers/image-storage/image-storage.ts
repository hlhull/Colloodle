import { Injectable } from '@angular/core';

import firebase from 'firebase';

/*
  Generated class for the ImageStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageStorageProvider {

  constructor() {
  }

  //store image in Firebase at group/sectionNum.png
  storeImage(dataUrl, sectionNum, group){
    var blob = this.dataUrlToBlob(dataUrl);

    // Create root reference
    var storageRef = firebase.storage().ref();

    // Name the file after the part of the image it is
    var sectionRef = storageRef.child(sectionNum + '.png');

    // Put the image in the correct group folder
    var groupRef = storageRef.child(group + '/' + sectionNum + '.png');

    //upload to firebase
    groupRef.put(blob).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
    });
  }

  // convert base64/URLEncoded data component to raw binary data held in a string
  // from: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158#5100158
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
