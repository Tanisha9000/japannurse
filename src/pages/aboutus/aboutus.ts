import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';

@IonicPage()
@Component({
    selector: 'page-aboutus',
    templateUrl: 'aboutus.html',
})
export class AboutusPage {

    data: any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController) {
        
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AboutusPage');
        this.aboutUs();
    }

    aboutUs() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'pages/about.json', options)
            .map(res => res.json())
            .subscribe(response => {
                loading.dismiss();
                console.log(response)
                if (response.response.status == true) {
                    this.data = response.response.data.description;
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
