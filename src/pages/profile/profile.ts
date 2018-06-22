import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController, Events} from 'ionic-angular';
import {EditprofilePage} from '../editprofile/editprofile';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {ChangepasswordPage} from '../changepassword/changepassword';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    userdata: any=[];
    imgurl: string;
    uscontact: any;
    overcontact: any;
    userimage = "assets/imgs/userimage.png";
    username:any; email:any; city: String; gender:any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public loadingCtrl: LoadingController,
        public alertCtrl : AlertController,
        public events : Events) 
    {
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata)
            this.getprofile();
        } 
        events.subscribe('dataaaa', (imgdata) => {
            this.getprofile();
        });       
        
    } 

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
    }

    getprofile() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url +'users/view/'+this.userdata.id+'.json',options)
            .map(res => res.json())
            .subscribe(response => {
                loading.dismiss();
                console.log(response)
                this.username = response.response.data.firstname+" "+response.response.data.lastname;
                this.email = response.response.data.email;
                this.uscontact = response.response.data.us_phone;
                this.gender= response.response.data.gender;
                this.city = response.response.data.city;
                if(response.response.data.image == ""){
                    this.userimage = "assets/imgs/userimage.png";
                }else{
                    this.imgurl = 'http://simerjit.gangtask.com/japannurse/';
                    this.userimage = this.imgurl+""+response.response.data.image;
                }
                
//                this.gender = response.response.data.overseas_phone;
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

    editprofile() {
        this.navCtrl.push(EditprofilePage);
    }
    changepass(){
        this.navCtrl.push(ChangepasswordPage)
    }

}
