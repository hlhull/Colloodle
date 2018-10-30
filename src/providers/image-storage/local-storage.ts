import { Injectable } from '@angular/core';

/*
  LocalStorageProvider saves images locally for pass-Around mode
*/
@Injectable()
export class LocalStorageProvider {
  storedImages = [];
  numCanvases;

  constructor() {
    this.numCanvases = 0;
  }

  setUp(group, section){}

  /*
   * store image with given image url in the array
   */
  storeImage(imgUrl){
      //store image in storedImages
      this.storedImages[this.numCanvases] = imgUrl;
      this.numCanvases = this.numCanvases + 1;

      //if we have 3 pictures
      if(this.numCanvases == 3){
        return new Promise(function(resolve, reject) { resolve(true) } );
      }
      return new Promise(function(resolve, reject) { resolve(false) } );
  }

  /*
   * gets the image urls
   */
  getImageUrls(){
    var pics = this.storedImages;
    return new Promise(function(resolve, reject) { resolve(pics); });
  }

}
