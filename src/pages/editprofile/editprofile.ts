import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ActionSheetController, ToastController, AlertController, Events, ViewController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {ProfilePage} from '../profile/profile';
import {Camera, CameraOptions} from '@ionic-native/camera';

@IonicPage()
@Component({
    selector: 'page-editprofile',
    templateUrl: 'editprofile.html',
})
export class EditprofilePage {
    userdata: any = [];
    imgurl: string;
    image_data: any;
    userimage = "assets/imgs/userimage.png";
    data: any = {
        username: '',
        email: '',
        uscontact: '',
        city: '',
        gender: ''
    }
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public viewCtrl : ViewController,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private camera: Camera,
        public events: Events) {
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata)
            this.getData();
        }
        //        setTimeout(() => {
        //                   
        //        },2000)

    }
    getData() {
        console.log('here we will get the user data');
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'users/view/' + this.userdata.id + '.json', options)
            .map(res => res.json())
            .subscribe(response => {
                loading.dismiss();
                console.log(response)
                this.data.username = response.response.data.firstname + " " + response.response.data.lastname;
                this.data.email = response.response.data.email;
                this.data.uscontact = response.response.data.us_phone;
                this.data.city = response.response.data.city;
                this.data.gender = response.response.data.gender;
                if (response.response.data.image == "") {
                    this.userimage = "assets/imgs/userimage.png";
                } else {
                    this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                    this.userimage = this.imgurl + "" + response.response.data.image;
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

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditprofilePage');
    }
    isReadonly() {
        return true;   //return true/false 
    }
    presentActionSheet() {
        const actionsheet = this.actionSheetCtrl.create({
            title: "Profile Photo",
            cssClass: 'title',
            buttons: [
                {
                    text: 'Camera',
                    icon: 'camera',
                    handler: () => {
                        this.getPicture(1); // 1 == Camera
                    }
                }, {
                    text: 'Gallery',
                    icon: 'images',
                    handler: () => {
                        this.getPicture(0); // 0 == Library
                    }
                },
                {
                    text: 'Remove',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.remove_photo();
                        console.log('Delete clicked');
                    }
                },
                {
                    icon: 'close',
                    cssClass: 'close',
                    role: 'close',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
            ]
        });
        actionsheet.present();
    }
    getPicture(sourceType: number) {
        // You can check the values here:
        // https://github.com/driftyco/ionic-native/blob/master/src/plugins/camera.ts
        this.camera.getPicture({
            quality: 10,
            destinationType: 0, // DATA_URL
            sourceType: sourceType,
            allowEdit: true,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }).then((imageData) => {
            this.image_data = imageData;
            this.userimage = 'data:image/jpeg;base64,' + imageData;
            //      this.postpic(imageData, bitt);
        }, (err) => {
            var toast = this.toastCtrl.create({
                message: JSON.stringify(err),
                duration: 3000,
                position: 'top'
            });
            toast.present();
        });
    }
    remove_photo() {
        let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Do you want to remove this photo?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('Yes clicked');
                        this.userimage = "assets/imgs/userimage.png";
                    }
                }
            ]
        });
        alert.present();

    }
    editProfile() {
        console.log(this.data)
        if (this.data.username == "") {
            let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'Please fill username field',
                buttons: ['Ok']
            });
            alert.present();
        } else {
            var result = this.data.username.search(' ');
            console.log(result)
            if (result != -1) {
                console.log('entered')
                var split = this.data.username.split(' ')

                let postdata = {
                    image: this.image_data,
                    firstname: split[0],
                    lastname: split[1],
                    city: this.data.city,
                    gender: this.data.gender,
                    us_phone: this.data.uscontact
                }

                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                let options = new RequestOptions({headers: headers});
                this.http.post(this.baseurlprovider.base_url + 'users/edit/'+this.userdata.id+ '.json',postdata, options)
                    .map(res => res.json())
                    .subscribe(response => {
                        console.log(response)
                        if(response.response.status == true){
                            let toast = this.toastCtrl.create({
                                message: response.response.msg,
                                duration: 3000,
                                position: 'top'
                            });
                            toast.present();                            
                        }
                        localStorage.setItem('userdata', JSON.stringify(response.response.data));
                        this.events.publish('dataaaa', response.response.data);
                        this.navCtrl.pop();
                    })
            } else {
                let alert = this.alertCtrl.create({
                    title: 'Alert!',
                    subTitle: 'Please fill your fullname',
                    buttons: ['Ok']
                });
                alert.present();
            }

        }
    }

}
