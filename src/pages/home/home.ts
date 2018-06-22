import {Component} from '@angular/core';
import {NavController, ToastController, AlertController, LoadingController, Events} from 'ionic-angular';
import {JobviewPage} from '../jobview/jobview';
import {NotificationPage} from '../notification/notification';
import {ModalController, NavParams} from 'ionic-angular';
import {FilterPage} from '../filter/filter';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    locations: any = [];
    filterjobs: any = [];
    noticount: any = 0;
    imgurl: string;
    alljobs: any = [];
    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public events: Events) {
        this.events.subscribe('counter', (count) => {
            console.log(count)
            this.noticount = this.noticount + 1;
        })

        this.getList();
    }
    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        setTimeout(() => {
            console.log('Async operation has ended');
            this.getList();
            refresher.complete();
        }, 2000);
    }

    jobview(id) {
        //        alert(id)
        this.navCtrl.push(JobviewPage, {
            jobid: id
        });
    }

    notification() {
        this.noticount = "";
        this.navCtrl.push(NotificationPage);
    }

    filter() {
        let modal = this.modalCtrl.create(FilterPage);
        modal.present();
        modal.onDidDismiss(res => {
            if (res == "cancel") {
                this.getList();
            } else {
                console.log('home page res')
                console.log(typeof (res));
                this.filterjobs = res;
                console.log(res)
                if (this.filterjobs.length == 0) {
                    let toast = this.toastCtrl.create({
                        message: 'Sorry! No data found',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                } else {
                    this.alljobs = [];
                    this.locations=[];
                    for (let j = 0; j < Object.keys(this.filterjobs).length; j++) {
                        for (let loc of this.filterjobs[j].location){
                           this.locations.push(loc.title)
                        }
                        console.log(j)
                        console.log(this.filterjobs[j])
                        console.log(this.filterjobs[j].department.image)
                        this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                        this.alljobs.push({'img': this.imgurl + "" + this.filterjobs[j].department.image, 'restdata': this.filterjobs[j],'location': this.locations.toString()});
                    }
                    console.log(this.alljobs)
                }

            }
        })
    }
    getList() {
        console.log('list of all jobs');
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'jobs/index.json', options)
            .map(res => res.json())
            .subscribe(response => {
                loading.dismiss();
                console.log(response)
                if (response.response.status == true) {
                    for (let j of response.response.data) {
                        this.locations = [];
                        //   console.log(j)
                        if (j.location) {
                            for (let loc of Object.keys(j.location)) {
                                //     console.log(j.location[loc])
                                this.locations.push(j.location[loc].title)
                            }
                            if (j.department.image) {
                                this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                                this.alljobs.push({'img': this.imgurl + "" + j.department.image, 'restdata': j, 'location': this.locations.toString()})
                            } else {
                                this.imgurl = "assets/imgs/userimage.png";
                                this.alljobs.push({'img': this.imgurl, 'restdata': j, 'location': this.locations.toString()})
                            }
                        } else {
                            if (j.department.image) {
                                this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                                this.alljobs.push({'img': this.imgurl + "" + j.department.image, 'restdata': j, 'location': ''})
                            } else {
                                this.imgurl = "assets/imgs/userimage.png";
                                this.alljobs.push({'img': this.imgurl, 'restdata': j, 'location': ''})
                            }
                        }
                    }
                    console.log(this.alljobs)
                } else {
                    let toast = this.toastCtrl.create({
                        message: 'Sorry! No data found',
                        duration: 3000,
                        position: 'top'
                    });
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

    onInput(event) {
        //        alert(event)
        this.alljobs = [];
        this.locations =[];
        console.log(event)
        let postdata = {
            keyword: event.target.value
        }
        console.log(postdata)
        if (postdata.keyword == undefined || postdata.keyword == "") {
            this.getList();
        } else {
            let headers = new Headers({'Content-Type': 'application/json'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.baseurlprovider.base_url + 'jobs/searchByName.json', postdata, options)
                .map(res => res.json())
                .subscribe(data => {
                    console.log(data)
                    if (data.response.status == true) {
                        this.alljobs=[];
                        for (let j of data.response.data) {
                            this.locations = [];
                            //   console.log(j)
                            if (j.location) {
                                for (let loc of Object.keys(j.location)) {
                                    //     console.log(j.location[loc])
                                    this.locations.push(j.location[loc].title)
                                }
                                if (j.department.image) {
                                    this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                                    this.alljobs.push({'img': this.imgurl + "" + j.department.image, 'restdata': j, 'location': this.locations.toString()})
                                } else {
                                    this.imgurl = "assets/imgs/userimage.png";
                                    this.alljobs.push({'img': this.imgurl, 'restdata': j, 'location': this.locations.toString()})
                                }
                            } else {
                                if (j.department.image) {
                                    this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                                    this.alljobs.push({'img': this.imgurl + "" + j.department.image, 'restdata': j, 'location': ''})
                                } else {
                                    this.imgurl = "assets/imgs/userimage.png";
                                    this.alljobs.push({'img': this.imgurl, 'restdata': j, 'location': ''})
                                }
                            }
                        }
                        console.log(this.alljobs)
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
