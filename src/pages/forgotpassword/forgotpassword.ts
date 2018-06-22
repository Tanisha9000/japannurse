import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ChangepasswordPage} from '../changepassword/changepassword';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {SigninPage} from '../signin/signin';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-forgotpassword',
    templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
    myform: FormGroup;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public formBuilder: FormBuilder,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider ) {
        this.myform = formBuilder.group({
            email: ['', Validators.required],
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ForgotpasswordPage');
    }

    forgotpassword(frmdata) {
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
                email: frmdata.value.email
            }
            console.log(postdata)
            let headers = new Headers({'Content-Type': 'application/json'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.baseurlprovider.base_url + 'users/forgotPassword.json', postdata, options)
                .map(res => res.json())
                .subscribe(data => {
                    console.log(data)
                    let toast = this.toastCtrl.create({
                        message: data.response.msg,
                        duration: 3000,
                        position: 'top'
                    });
                    if (data.response.status == true) {
                        toast.present();
                        this.navCtrl.push(SigninPage)
                    }else{
                        toast.present();
                    }

                })
        }
    }



}
