import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {SigninPage} from '../signin/signin';

@IonicPage()
@Component({
    selector: 'page-changepassword',
    templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
    userdata: any =[];
    myform: FormGroup;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public formBuilder: FormBuilder) 
    {
        
        this.myform = formBuilder.group({
            oldpass: ['', Validators.required],
            newpass: ['', Validators.required],
            retypepass: ['', Validators.required],
        });
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata)
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChangepasswordPage');
    }

    changepassword(frmdata) {
        if (!this.myform.valid) {
            console.log('not valid')
            let toast = this.toastCtrl.create({
                message: 'Please fill all the details accurately',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        } else {
            let postdata = {
                old_password: frmdata.value.oldpass,
                new_password: frmdata.value.newpass,
                confirm_password: frmdata.value.retypepass,
                id: this.userdata.id
            }
            console.log(postdata)
            var serialised = this.baseurlprovider.serializeObj(postdata)
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.baseurlprovider.base_url + 'users/changePassword.json', serialised, options)
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
                        this.navCtrl.setRoot(SigninPage);
                    }else{
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
