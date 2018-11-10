import { Injectable } from '@angular/core';

/*
  LocalStorageProvider saves images locally for pass-Around mode
*/
@Injectable()
export class LocalStorageProvider {
  storedImageUrls = [];
  sectionNumber;

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

}
