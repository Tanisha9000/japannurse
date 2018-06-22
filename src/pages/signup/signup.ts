import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {SigninPage} from '../signin/signin';

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
})
export class SignupPage {
    m: number;
    data: any = {
        firstname: '',
        lastname: '',
        city: '',
        email: '',
        pass: '',
        confirmpass: '',
        usphone: '',
    };
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private toastCtrl: ToastController,
        private baseurlprovider: BaseurlapiProvider,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController) {
    }
    onInput(e) {
        console.log(e);
        console.log("input is triggered");
        if (this.data.pass == "") {
            let alert = this.alertCtrl.create({
                title: 'Error ',
                subTitle: 'Enter password first',
                buttons: ['OK']
            });
            alert.present();
        } else {
            if (this.data.pass == this.data.confirmpass) {
                this.m = 1;
                setTimeout(() => {
                    this.m = 3;
                }, 2000)
            } else {
                this.m = 0;
            }
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignupPage');
    }

    signup(frmdata) {
        console.log(frmdata);
        if (!frmdata.valid) {
            console.log('not valid')
            let toast = this.toastCtrl.create({
                message: 'Please fill all the mandatory details accurately',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        } else {
                console.log('all done')
                let loading = this.loadingCtrl.create({
                    spinner: 'hide',
                    content: 'Loading Please Wait...'
                });
                loading.present();
                let postdata = {
                    email: frmdata.value.email,
                    password: frmdata.value.pass,
                    firstname: frmdata.value.firstname,
                    lastname: frmdata.value.lastname,
                    city: frmdata.value.city,
                    us_phone: frmdata.value.usphone,
                }
                console.log(postdata)
                let headers = new Headers({'Content-Type': 'application/json'});
                let options = new RequestOptions({headers: headers});
                this.http.post(this.baseurlprovider.base_url + 'users/add.json', postdata, options)
                    .map(res => res.json())
                    .subscribe(data => {
                        loading.dismiss();
                        console.log(data) 
                        let toast = this.toastCtrl.create({
                            message: data.response.msg,
                            duration: 3000,
                            position: 'top'
                        });
                        if (data.response.status == true) {
                            toast.present();
                            this.navCtrl.setRoot(SigninPage);
                        }else{
                            toast.present();
                        }

                    }, err => {
                        loading.dismiss();
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
