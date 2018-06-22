import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import moment from 'moment';
import {JobviewPage} from '../jobview/jobview';

@IonicPage()
@Component({
    selector: 'page-notification',
    templateUrl: 'notification.html',
})
export class NotificationPage {
    locations: any=[];
    currentdate: any;
    allnotifications: any = [];
    userdata: any = [];
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            this.getnotifications();
        }
    }



    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationPage');
    }

    getnotifications() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'notifications/index/' + this.userdata.id + '.json', options)
            .map(res => res.json())
            .subscribe(response => {
                loading.dismiss();
                console.log(response)
                this.currentdate = moment().format('DD-MMM-YYYY hh:mm a');
                var todate = this.currentdate
                console.log('time: ', todate);
                for (let i of response.response.data) {
                    this.locations = [];

                    for (let loc of Object.keys(i.job.location)) {
                        this.locations.push(i.job.location[loc].title)
                    }
                    if (i.type == "job_detail") {
                        var fromDate = i.created;
                        var frmdate = moment.utc(fromDate);
                        console.log(frmdate.format('DD-MMM-YYYY hh:mm a'));
                        let hourDiff = frmdate.diff(todate, 'hours');
                        console.log(hourDiff)
                        var minuteDiff = frmdate.diff(todate, 'minutes');
                        let hourDuration = Math.floor(minuteDiff / 60);
                        let minuteDuration = minuteDiff % 60;
                        if (hourDuration == 0) {
                            this.allnotifications.push({'min': Math.abs(minuteDuration) + "Mins ago", 'restdata': i,'location': this.locations.toString()})
                        } else {
                            if (minuteDuration == 0) {
                                this.allnotifications.push({'min': Math.abs(hourDuration) + 'Hr', 'restdata': i,'location': this.locations.toString()})
                            } else {
                                this.allnotifications.push({'min': Math.abs(hourDuration) + 'Hr' + " " + Math.abs(minuteDuration) + "Mins ago", 'restdata': i,'location': this.locations.toString()})
                            }
                        }
                        console.log('minutes are' + minuteDuration + ',' + 'hours are' + hourDuration)
                    }
                }
                if (this.allnotifications.length == 0) {
                    let toast = this.toastCtrl.create({
                        message: 'There are no notifications for the job',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                }
                console.log(this.allnotifications)
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
    deletejob(notid, ind) {
        let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Do you want to delete this notification?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        let loading = this.loadingCtrl.create({
                            spinner: 'hide',
                            content: 'Loading Please Wait...'
                        });
                        loading.present();
                        let headers = new Headers();
                        headers.append('Content-Type', 'application/json');
                        let options = new RequestOptions({headers: headers});
                        this.http.post(this.baseurlprovider.base_url + 'notifications/delete/' + notid + '.json', options)
                            .map(res => res.json())
                            .subscribe(response => {
                                loading.dismiss();
                                console.log(response)
                                if (response.response.status == true) {
                                    let toast = this.toastCtrl.create({
                                        message: response.response.msg,
                                        duration: 3000,
                                        position: 'top'
                                    });
                                    toast.present();
                                    this.allnotifications.splice(ind, 1)
                                    console.log(this.allnotifications)
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
            ]
        });
        alert.present();
    }
    jobview(job_id) {
        this.navCtrl.push(JobviewPage, {
            jobid: job_id
        })
    }

}
