import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, Events, AlertController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {SigninPage} from '../pages/signin/signin';
import {ProfilePage} from '../pages/profile/profile';
import {SignupPage} from '../pages/signup/signup';
import {AboutusPage} from '../pages/aboutus/aboutus';
import {ContactusPage} from '../pages/contactus/contactus';
import {PdfPage} from '../pages/pdf/pdf';
import {JobviewPage} from '../pages/jobview/jobview';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../providers/baseurlapi/baseurlapi';
import {Firebase} from '@ionic-native/firebase';
import {RequestjobPage} from '../pages/requestjob/requestjob';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    count: number=0;
    url: string;
    allpdfs: any = [];
    imgurl: string;
    userdata: any;
    alertShown: boolean = false;
    useremail: string;
    username: any;
    userimage: string;
    imgdata: string;
    @ViewChild(Nav) nav: Nav;

    rootPage: any = '';

    // pages: Array<{title: string, component: '',icon:''}>;
    pages: any;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public http: Http,
        private baseurlprovider: BaseurlapiProvider, public events: Events, private alertCtrl: AlertController, private firebase: Firebase) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Home', component: HomePage, icon: 'assets/imgs/home1.png'},
            {title: 'Profile', component: ProfilePage, icon: 'assets/imgs/person.png'},
            {title: 'About Us', component: AboutusPage, icon: 'assets/imgs/question.png'},
            {title: 'Contract Us', component: ContactusPage, icon: 'assets/imgs/phone.png'},
            {title: 'Pdf', component: PdfPage, icon: 'assets/imgs/pdf.png'},
            {title: 'Logout', icon: 'assets/imgs/logout.png'}
        ];
        events.subscribe('dataaaa', (userdata) => {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);
            this.username = this.userdata.firstname + " " + this.userdata.lastname;
            this.useremail = this.userdata.email;
            if (this.userdata.image == "") {
                this.userimage = "assets/imgs/userimage.png";
            } else {
                this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                this.userimage = this.imgurl + "" + this.userdata.image;
            }

        })

        events.subscribe('imgdata', (immgg) => {
            if (localStorage.getItem('imgdata')) {
                this.userdata = JSON.parse(localStorage.getItem('userdata'));
                console.log(this.userdata)
                this.username = this.userdata.firstname + " " + this.userdata.lastname;
                this.useremail = this.userdata.email;
                if (this.userdata.image == "") {
                    this.userimage = "assets/imgs/userimage.png";
                } else {
                    this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                    this.userimage = this.imgurl + "" + this.userdata.image;
                }
            }
        })
    }
    
    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.firebase.grantPermission();
      //      alert('tanisha')
            alert('code updated.keep doing')
            if (localStorage.getItem('userdata')) {
                console.log(localStorage.getItem('userdata'))
                this.userdata = JSON.parse(localStorage.getItem('userdata'));
            //    console.log(this.userdata);
                this.username = this.userdata.firstname + " " + this.userdata.lastname;
                this.useremail = this.userdata.email;
                if (this.userdata.image == "") {
                    this.userimage = "assets/imgs/userimage.png";
                } else {
                    this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                    this.userimage = this.imgurl + "" + this.userdata.image;
                    console.log(this.userimage)
                }
                this.nav.setRoot(HomePage);
            } else {
                this.nav.setRoot(SigninPage);
            }
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.platform.registerBackButtonAction(() => {
                if (this.alertShown == false) {
                    this.myHandlerFunction();
                }
            }, 0)

            if (this.platform.is('cordova')) {
                if (this.platform.is('android')) {
                    this.subscribeToPushNotificationEvents();
                } else {
                this.initializeFireBaseIos();
                }
            } else {
                console.log('Push notifications are not enabled since this is not a real device');
            }
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        if (page.title == "Logout") {
            let alert = this.alertCtrl.create({
                title: 'Confirm',
                message: 'Do you want to logout?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            localStorage.removeItem('userdata');
                            this.nav.setRoot(SigninPage);
                        }
                    }
                ]
            });
            alert.present();
        }
    }
    myHandlerFunction() {
        let alert = this.alertCtrl.create({
            title: 'Do you want to exit?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        navigator['app'].exitApp();
                        console.log('Ok clicked');
                        localStorage.removeItem('userdata');
                    }
                },
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('cancel clicked');
                        this.alertShown = false;
                    }
                },
            ]
        });
        alert.present().then(() => {
            this.alertShown = true;
        });
    }
    private initializeFireBaseIos(): Promise<any> {
        return this.firebase.grantPermission()
            .catch(error => console.error('Error getting permission', error))
            .then(() => {
                this.firebase.getToken()
                    .catch(error => console.error('Error getting token', error))
                    .then(token => {
                        console.log(`The token is ${token}`);

                        Promise.all([
                            this.firebase.subscribe('firebase-app'),
                            this.firebase.subscribe('ios'),
                            this.firebase.subscribe('userid-2')
                        ]).then((result) => {

                            if (result[0]) console.log(`Subscribed to FirebaseDemo`);
                            if (result[1]) console.log(`Subscribed to iOS`);
                            if (result[2]) console.log(`Subscribed as User`);

                            this.subscribeToPushNotificationEvents();
                        });
                    });
            })

    }  

    private subscribeToPushNotificationEvents(): void {
        this.firebase.onNotificationOpen().subscribe(    
            (notification) => { 
                if(notification.notification_type == "job_detail"){
                   this.events.publish('counter',this.count) 
                }  
                if (notification.tap) {          
                    //   alert("taped")
                  //     alert('alert - > ' + JSON.stringify(notification))
                    console.log(notification)
                    if (notification.notification_type == "job_detail") {
                        this.nav.push(JobviewPage,{
                        jobid : notification.job_id})
                    }
                    if(notification.notification_type == "job_detail_chat"){
                        this.nav.push(RequestjobPage,{
                            job_id : notification.job_id
                        })
                    }

                }
            },error => {
                console.error('Error getting the notification', error);
    //            alert(JSON.stringify(error))
            });
    }
}
