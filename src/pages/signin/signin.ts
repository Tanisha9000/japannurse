import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController, Events, AlertController} from 'ionic-angular';
import {ForgotpasswordPage} from '../forgotpassword/forgotpassword';
import {SignupPage} from '../signup/signup';
import {HomePage} from '../home/home';
import {FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import { Platform } from 'ionic-angular';
import {Firebase} from '@ionic-native/firebase';

@IonicPage()
@Component({
    selector: 'page-signin',
    templateUrl: 'signin.html',
})
export class SigninPage {
    devicetype: string;
    myform: FormGroup;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController,
        public events: Events,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private firebase: Firebase,
        public platform: Platform) 
        {
         this.myform = formBuilder.group({
            email: ['', Validators.compose([Validators.required]), this.emailValidator.bind(this)],
            pass: ['', Validators.required]
        });
    }
    emailValidator(control: FormControl) {
        return new Promise(resolve => {
            if (!(control.value.toLowerCase().match('^[a-z0-9]+(\.[_a-z0-9]+)+([@{1}])+(\.[a-z0-9-]+)+([.{1}])(\.[a-z]{1,15})$'))) {
                resolve({
                    invalidEmail: true
                })
            } else {
                resolve(null);
            }
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SigninPage');
    }
    forgot() {
        this.navCtrl.push(ForgotpasswordPage);
    }

    signup() {
        this.navCtrl.push(SignupPage);
    }

    home(frmdata) {
        if (!this.myform.valid) {
            console.log('not valid')
            let toast = this.toastCtrl.create({
                message: 'Please fill all the details accurately',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        } else {
            var postdata = {
                email: frmdata.value.email,
                password: frmdata.value.pass
            }
            console.log(postdata)
            //   console.log('tanisha')
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
            headers.append('Content-Type', 'application/json; charset=UTF-8');
            //        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            //            var serialised = this.baseurlprovider.serializeObj(postdata)
            this.http.post(this.baseurlprovider.base_url + 'users/login.json', postdata, options)
                .map(res => res.json())
                .subscribe(data => {
                    console.log(data)
                    if (data.response.status == true) {                        
                        localStorage.setItem('userdata', JSON.stringify(data.response.data));
                        this.events.publish('dataaaa', data.response.data);
                        if(data.response.data.users_details.length != 0){
                          localStorage.setItem('applydata', JSON.stringify(data.response.data.users_details));    
                        }    
                        if (this.platform.is('cordova')) {
                            if (this.platform.is('android')) {
                               console.log('android') 
                               this.devicetype = 'android';
                            } else {
                               console.log('ios')
                                this.devicetype = 'ios'
                            }
                        } else {
                            console.log('Push notifications are not enabled since this is not a real device');
                        }
                        this.firebase.getToken().then(token => {
                            console.log(`The token is ${token}`)
                         //   alert(token)
                            this.firebase.onTokenRefresh().subscribe((token: string) => {
                                console.log(`Got a new token ${token}`)
                        //        alert(token)
                                var post1 = {
                                    device_token: token,
                                    device_type: this.devicetype
                                }
                                console.log(post1)
                                let headers = new Headers();
                                headers.append('Content-Type', 'application/json; charset=UTF-8');
                                let options = new RequestOptions({headers: headers});
                                this.http.post(this.baseurlprovider.base_url + 'users/updateToken/' + data.response.data.id + '.json', post1, options)
                                    .map(res => res.json())
                                    .subscribe(data => {
                                        console.log(data)
                        //                alert(data)
                        //                alert(JSON.stringify(data))
                                        if (data.response.status == true) {
                                            this.navCtrl.push(HomePage);
                                        }
                                    })
                            }, (err) => {
                                console.log(err)
                            });
                        }).catch(error => {
                            console.error('Error getting token', error)
                        });

                    } else {
                        let toast = this.toastCtrl.create({
                            message: data.response.msg,
                            duration: 3000,
                            position: 'top'
                        });
                        toast.present();
                    }

                }, err => {
                    let alert = this.alertCtrl.create({
                        title: 'Internal Server Error !!',
                        subTitle: 'There is a problem with the resource you are looking for.Please try again later.',
                        buttons: ['OK']
                    });
                    alert.present();
                })
        }
    }

}
