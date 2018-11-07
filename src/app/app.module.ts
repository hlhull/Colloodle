import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home';
import { DrawingPage } from '../pages/drawing/drawing';
import { FinalPage } from '../pages/final/final';

import { CanvasDrawComponent } from '../components/canvas-draw/canvas-draw';

import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';
import { PopoverPage } from '../pages/color-popover/color-popover';
import { BrushProvider } from '../providers/brush/brush';
import { NetworkStorageProvider } from '../providers/image-storage/network-storage';
import { LocalStorageProvider } from '../providers/image-storage/local-storage';
import { ImageStorageProvider } from '../providers/image-storage/image-storage';

//firebase stuff:
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { config } from '../config';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { UserPopoverPage } from '../pages/user-popover/user-popover';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { GroupManagerProvider } from '../providers/group-manager/group-manager';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    DrawingPage,
    FinalPage,
    CanvasDrawComponent,
    PopoverPage,
    UserPopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config), //firebase stuff
    NgxErrorsModule //also helps with firebase stuff, login page
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    DrawingPage,
    PopoverPage,
    UserPopoverPage,
    FinalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    BrushProvider,
    ImageStorageProvider,
    LocalStorageProvider,
    NetworkStorageProvider,
    AngularFireAuth,
    AuthService,
    ScreenOrientation,
    GroupManagerProvider
  ]
})
export class AppModule {}
