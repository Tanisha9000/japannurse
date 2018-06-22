import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Firebase } from '@ionic-native/firebase';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { SigninPage } from '../pages/signin/signin';
import { AboutPage } from '../pages/about/about';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { ProfilePage } from '../pages/profile/profile';
import { SignupPage } from '../pages/signup/signup';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { ContactusPage } from '../pages/contactus/contactus';
import { PdfPage } from '../pages/pdf/pdf';
import { JobviewPage } from '../pages/jobview/jobview';
import { RequestjobPage } from '../pages/requestjob/requestjob';
import { NotificationPage } from '../pages/notification/notification';
import { FilterPage } from '../pages/filter/filter';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BaseurlapiProvider } from '../providers/baseurlapi/baseurlapi';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SigninPage,
    ChangepasswordPage,
    EditprofilePage,
    ForgotpasswordPage,
    ProfilePage,
    SignupPage,
    AboutusPage,
    ContactusPage,
    PdfPage,
    JobviewPage,
    NotificationPage,
    FilterPage,
    RequestjobPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule, 
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SigninPage,
    ChangepasswordPage,
    EditprofilePage,
    ForgotpasswordPage,
    ProfilePage,
    SignupPage,
    AboutusPage,
    ContactusPage,
    PdfPage,
    JobviewPage,
    NotificationPage,
    FilterPage,
    RequestjobPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    Camera,
    FileTransfer,
    FileTransferObject,
    File,
    SocialSharing,  
    Firebase , 
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpModule,
    BaseurlapiProvider
  ]
})
export class AppModule {}
