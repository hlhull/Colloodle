import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  ImageStorageProvider contains the methods needed in NetworkStorageProvider
  and LocalStorageProvider to save and retrieve image data
*/
@Injectable()
export class ImageStorageProvider {

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

}
