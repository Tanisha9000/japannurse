import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';


@IonicPage()
@Component({
    selector: 'page-contactus',
    templateUrl: 'contactus.html',
})
export class ContactusPage {
    myform: FormGroup;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController) {
        this.myform = formBuilder.group({
            email: ['', Validators.compose([Validators.required]), this.emailValidator.bind(this)],
            firstname: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])],
            lastname: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])],
            businessphone: ['', Validators.required],
            military: ['', Validators.required],
            japancell: ['', Validators.required],
            usnumber: ['', Validators.required],
            location: ['', Validators.required],
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ContactusPage');
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
    contract(frmdata) {
        console.log(frmdata)
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
                first_name: frmdata.value.firstname,
                last_name: frmdata.value.lastname,
                business_phone: frmdata.value.businessphone,
                military_base: frmdata.value.military,
                japan_cell_number: frmdata.value.japancell,
                us_cell_number: frmdata.value.usnumber,
                current_location: frmdata.value.location
            }
            console.log(postdata)
            let headers = new Headers({'Content-Type': 'application/json'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.baseurlprovider.base_url + 'contracts/add.json', postdata, options)
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
                        this.myform = this.formBuilder.group({
                            email: [''],
                            firstname: [''],
                            lastname: [''],
                            businessphone: [''],
                            military: [''],
                            japancell: [''],
                            usnumber: [''],
                            location: [''],
                        });
                    } else {

                        toast.present();
                    }

                })
        }
    }


}
