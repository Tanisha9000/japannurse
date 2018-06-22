import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Events} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {SocialSharing} from '@ionic-native/social-sharing';
import {RequestjobPage} from '../requestjob/requestjob';
import {AboutPage} from '../about/about';

@IonicPage()
@Component({
    selector: 'page-jobview',
    templateUrl: 'jobview.html',
})
export class JobviewPage {
    locations: any;
    bit: number;
    containdata: any = [];
    userdata: any;
    alldata: any;
    expnedu: any;
    jobsummary: any;
    location: any=[];
    title: any;
    depttitle: any;
    jobid: any;
    btnname = "";
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private socialSharing: SocialSharing,
        public events: Events) {
        this.btnname = "Apply Job"
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'))
        }

        this.events.subscribe('buttonchange', (bit) => {
            //         alert(this.btnname)
            this.btnname = "Applied";
            //         alert(this.btnname)
            console.log(this.btnname)
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad JobviewPage');
        this.viewjob();
    }


    viewjob() {
        this.jobid = this.navParams.get('jobid');
        console.log(this.jobid)
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'jobs/view/' + this.jobid + '.json', options)
            .map(res => res.json())
            .subscribe(response => {
                loading.dismiss();
                console.log(response)
                if (response.response.status == true) {
                    this.containdata = response.response.data;
                    this.alldata = 'Department:' + response.response.data.department.title + '\nApply for:' + response.response.data.title +
                        '\nJob Description:' + response.response.data.job_summary + '\n' + '\nExperience & Education required :' + response.response.data.experience_education_requirements;
                    this.depttitle = response.response.data.department.title;
                    this.title = response.response.data.title;
                    this.jobsummary = response.response.data.job_summary;
                    this.expnedu = response.response.data.experience_education_requirements;
                    for(let loc of response.response.data.location){
                        this.location.push(loc.title)
                    }
                    this.locations = this.location.toString();
                    for (let k of response.response.data.jobs_apply) {
                        if (k.user_id == this.userdata.id) {
                            this.btnname = "Applied";
                        }
                    }
                }
                //                console.log(this.alldata)
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
    sharefacebook() {
        this.socialSharing.shareViaFacebook(this.alldata, '', 'https://www.facebook.com/ontimestaffingokinawa/').then((res) => {
            let toast = this.toastCtrl.create({
                message: res,
                duration: 3000, 
                position: 'top'
            });
            toast.present();
        }).catch((err) => {
      //  alert(err)
            let toast = this.toastCtrl.create({
                message: err,
                duration: 3000,
                position: 'top'
            });
            toast.present();
        })
    }
    sharetwitter() {
        this.socialSharing.shareViaTwitter(this.alldata, '', 'https://twitter.com/japangovjobs').then((ress) => {
            let toast = this.toastCtrl.create({
                message: ress,
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }).catch((err) => {
            let toast = this.toastCtrl.create({
                message: err,
                duration: 3000,
                position: 'top'
            });
            toast.present(); 
        })
    }
    shareinsta() {
        this.socialSharing.shareVia('LinkedIn', this.alldata, 'Job sharing', '', 'www.linkedin.com/in/japan-government-jobs-970bb7151').then((response) =>{
            let toast = this.toastCtrl.create({
                message: response,
                duration: 3000,
                position: 'top'
            });
            toast.present();  
        }).catch((err) => {
            let toast = this.toastCtrl.create({
                message: err,
                duration: 3000,
                position: 'top'
            });
            toast.present();
        })
    }
//    sharegoogle() {
//        // Check if sharing via email is supported
//        this.socialSharing.canShareViaEmail().then((res) => {
//            console.log(res)
//            this.socialSharing.shareViaEmail(this.alldata, 'Job Description', ['recipient@example.org']).then(() => {
//                // Success!
//            }).catch((err) => {
//                //       alert(err)
//            });
//        }).catch((error) => {
//            // Sharing via email is not possible
//            //      alert(error)
//        });
//    }
    applyJob() {
        if (localStorage.getItem('applydata')) {
            this.job_apply();
        } else {
            this.navCtrl.push(AboutPage, {
                job_id: this.jobid
            })
        }

    }
    job_apply() {
        let postdata = {
            user_id: this.userdata.id,
            job_id: this.jobid
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
                    this.bit = 1;
                    this.events.publish('buttonchange', this.bit)
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
    requestjob() {
        this.navCtrl.push(RequestjobPage, {
            job_id: this.jobid
        })
    }


}
