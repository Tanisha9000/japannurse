import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Events,Nav} from 'ionic-angular';
import {FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import {DatePipe} from '@angular/common';
import 'rxjs/add/operator/map';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {SigninPage} from '../signin/signin';
import {JobviewPage} from '../jobview/jobview';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
    dates: any=[];
    jobid: any;
    bit: any=0;
    userdata: any=[];
    m: number;
    myform: FormGroup;
    todaydate = new Date();
    datee = this.datepipe.transform(this.todaydate, 'MM-dd-yyyy');
    data: any = {
        todate: this.datee,
        firstname: '',
        lastname: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        usphone: '',
        overphone: '',
        posapply: '',
        jobpos: '',
        expectrate: '',
        felony: '',
        license: '',
        arrested: '',
        impairment: '',
        hospitalise: '',
        treatment: '',
        drug: '',
        substances: '',
        explanation: '',
        uscitizen: '',
        passport: '',
        residence: '',
        professional: '',
        education: '',
        immunization: '',
        certification: '',
        board: '',
        contract: '',
        finalsubmit: '',
        dateee: '',
        month: '',
        derosdatee: '',
        derosmonth: '',

    };
    allmonths: any = [];
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public http: Http,
        public datepipe: DatePipe,
        private toastCtrl: ToastController,
        private baseurlprovider: BaseurlapiProvider,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public events : Events,
        public nav : Nav) {
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'))
        }
        for (let i = 1; i < 32; i++) {
            this.allmonths.push(i);
        }
        for(let j=1 ; j < 13; j++){
            this.dates.push(j)
        }
        console.log(this.allmonths);
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

    isReadonly() {
        return true;   //return true/false 
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AboutPage');
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
            let str = (this.data.month).toString();
            let str12 = (this.data.derosmonth).toString();
            let split = str.split(':');
            let deros = str12.split(':');
            console.log(deros + "," + split)
            if (frmdata.value.malpractice == 'true' || frmdata.value.felony == 'true' || frmdata.value.license == 'true' || frmdata.value.arrested == 'true' || frmdata.value.impairment == 'true' || frmdata.value.hospitalise == 'true' || frmdata.value.treatment == 'true' || frmdata.value.drug == 'true' || frmdata.value.substances == 'true' || frmdata.value.uscitizen == 'true') {
                let toast = this.toastCtrl.create({
                    message: 'Please fill in the correct details as you have chosen yes option',
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            } else {
                if(frmdata.value.finalsubmit == 'false'){
                let toast = this.toastCtrl.create({
                    message: 'Please agree to the information filled, by selecting yes option.',
                    duration: 3000,
                    position: 'top'
                });
                toast.present();                    
                }else{
                console.log('all done')
                let loading = this.loadingCtrl.create({
                    spinner: 'hide',
                    content: 'Loading Please Wait...'
                });
                loading.present();
                let postdata = {
                    today_date: frmdata.value.todate,
                    firstname: frmdata.value.firstname,
                    lastname: frmdata.value.lastname,
                    street_address: frmdata.value.address,
                    city: frmdata.value.city,
                    state: frmdata.value.state,
                    zipcode: frmdata.value.zip,
                    country: frmdata.value.country,
                    us_phone: frmdata.value.usphone,
                    overseas_phone: frmdata.value.overphone,
                    UsersDetails: [{
                        position_applying_for: frmdata.value.posapply,
                        find_out: frmdata.value.jobpos,
                        expected_hourly_rate: frmdata.value.expectrate,
                        malpractice_claim: JSON.parse(frmdata.value.malpractice),
                        misdemeanor_case: JSON.parse(frmdata.value.felony),
                        certification_revoked: JSON.parse(frmdata.value.license),
                        arrested_charged: JSON.parse(frmdata.value.arrested),
                        any_impairment: JSON.parse(frmdata.value.impairment),
                        hospitalized: JSON.parse(frmdata.value.hospitalise),
                        mental_therapy: JSON.parse(frmdata.value.treatment),
                        drug_therapy: JSON.parse(frmdata.value.drug),
                        use_of_controlled_substances: JSON.parse(frmdata.value.substances),
                        detail: frmdata.value.explanation,
                        us_citizenship: JSON.parse(frmdata.value.uscitizen),
                        dual_citizenship: frmdata.value.passport,
                        legal_residence: frmdata.value.residence,
                        professional_license: frmdata.value.professional,
                        educational_degree: frmdata.value.education,
                        immunization_expiry_date: frmdata.value.immunization,
                        expiration_date_cpr: frmdata.value.certification,
                        board_certification: frmdata.value.board,
                        additional_information: frmdata.value.contract,
                        date_of_arrival_overseas: frmdata.value.dateee + "-" + split,
                        expected_deros_date: frmdata.value.derosdatee + "-" + deros,
                        accept_conditions: JSON.parse(frmdata.value.finalsubmit)
                    }]

                }
                console.log(postdata)
                //             return false;
                let headers = new Headers({'Content-Type': 'application/json'});
                let options = new RequestOptions({headers: headers});
                this.http.post(this.baseurlprovider.base_url + 'users/filldetails/'+this.userdata.id+'.json', postdata, options)
                    .map(res => res.json())
                    .subscribe(data => {
                        loading.dismiss();
                        console.log(data) 
                        if (data.response.status == true) {
                            localStorage.setItem('applydata', JSON.stringify(data.response.data.users_details[0]));
                            let postdata = {
                                user_id: this.userdata.id,
                                job_id: this.navParams.get('job_id')
                            }
                            let headers = new Headers();
                            headers.append('Content-Type', 'application/json');
                            let options = new RequestOptions({headers: headers});
                            this.http.post(this.baseurlprovider.base_url + 'jobs-apply/add.json', postdata, options)
                                .map(res => res.json())
                                .subscribe(response => {
                                    console.log(response)
                                    if (response.response.status == true) {
                                        let toast = this.toastCtrl.create({
                                            message: response.response.msg,
                                            duration: 3000,
                                            position: 'top'
                                        });
                                        toast.present();                                        
                                        this.bit =1;
                                        this.jobid = this.navParams.get('job_id');
                                        this.events.publish('buttonchange',this.bit)
                                        this.nav.pop();
                                    } else {
                                        let toast = this.toastCtrl.create({
                                            message: response.response.msg,
                                            duration: 3000,
                                            position: 'top'
                                        });
                                        toast.present();
                                    }
                                 })  
                            
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

    }
}
