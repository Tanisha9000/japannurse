import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';


@IonicPage()
@Component({
    selector: 'page-requestjob',
    templateUrl: 'requestjob.html',
})
export class RequestjobPage {
    interval: any;
    userid: any;
    reschat: any;
    allchat: any = [];
    admin: any;
    jobid: any;
    mee: any;
    userdata: any = [];
    data: any = {
        message: ''
    }
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController) {
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            this.userid = this.userdata.id
        }
        this.getrequestdetail();
    }
    doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getrequestdetail();
      refresher.complete();
    }, 2000);
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RequestjobPage');
        this.interval = setInterval(() => {
            this.getrequestdetail();
        }, 5000);
    }
   ionViewWillLeave(){
       if(this.interval){
        clearInterval(this.interval)   
       }      
   }

    getrequestdetail() {
        this.jobid = this.navParams.get('job_id');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.post(this.baseurlprovider.base_url + 'requests/view/' + this.jobid +"/"+ this.userdata.id+ '.json', options)
            .map(res => res.json())
            .subscribe(response => {
                console.log(response)     
                if (response.response.status == true) {
                    for (let i = 0; i < response.response.data.length; i++) {
                        let index = this.allchat.findIndex(x => x.id == response.response.data[i].id);
                        if (index == -1) {
                            this.allchat.push(response.response.data[i]);
                        }
                    }
                    console.log(this.allchat)
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

    requeston() {
        var postdata = {
            sender_id: this.userdata.id,
            receiver_id: 1,
            job_id: this.navParams.get('job_id'),
            message: this.data.message
        }
        console.log(postdata)
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        let options = new RequestOptions({headers: headers});
        this.http.post(this.baseurlprovider.base_url + 'requests/add.json', postdata, options)
            .map(res => res.json())
            .subscribe(data => {
                console.log(data)
                if (data.response.status == true) {
                    this.data.message = "";
                    this.getrequestdetail();
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
