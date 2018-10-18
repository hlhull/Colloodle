import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DrawingPage } from '../pages/drawing/drawing';
import { DrawingLandscapePage } from '../pages/drawing-landscape/drawing-landscape';
import { FinalPage } from '../pages/final/final';

import { CanvasDrawComponent } from '../components/canvas-draw/canvas-draw';

import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';
import { PopoverPage } from '../pages/color-popover/color-popover';
import { BrushProvider } from '../providers/brush/brush';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DrawingPage,
    DrawingLandscapePage,
    FinalPage,
    CanvasDrawComponent,
    PopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DrawingPage,
    DrawingLandscapePage,
    PopoverPage,
    FinalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    BrushProvider
  ]
})
export class AppModule {}
