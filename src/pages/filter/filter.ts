import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ViewController} from 'ionic-angular';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {Http, Headers, RequestOptions} from '@angular/http';

@IonicPage()
@Component({
    selector: 'page-filter',
    templateUrl: 'filter.html',
})
export class FilterPage {
bit:number = 0;
    dataaa: string;
    lists: any = [];
    locations: any = [];
    departments: any = [];
    subdepartments: any = [];
    data = {
        dept: '',
        subdept: '',
        loc: ''
    }
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public viewCtrl: ViewController) {
        this.getDept();
        this.getlocation();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FilterPage');
    }

    closeModal() {
        this.viewCtrl.dismiss('cancel');
        //    this.navCtrl.pop();
    }
    getDept() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'departments/index.json', options)
            .map(res => res.json())
            .subscribe(response => {
                loading.dismiss();
                console.log(response)
                if (response.response.status == true) {
                    for (let i of response.response.data) {
                        this.departments.push(i);
                    }
                    console.log(this.departments)
                }
            })
    }

    onSelectChange(id) {
        //        alert(id)
        this.bit = 1;
        
        console.log(id)
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'jobs/getsubdepartments/' + id + '.json', options)
            .map(res => res.json())
            .subscribe(response => {
                console.log(response)
                for (let j of Object.keys(response.subdepartments)) {
                    this.subdepartments.push({'subid': j, 'subname': response.subdepartments[j]});
                }
                console.log(this.subdepartments)
            })
    }
    getlocation() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'locations/index.json', options)
            .map(res => res.json())
            .subscribe(response => {
                console.log(response)
                if (response.response.status == true) {
                    for (let i of response.response.data) {
                        this.locations.push(i);
                    }
                    console.log(this.locations)
                }
            })
    }
    search() {
        if (this.data.subdept) {
            var postdata = {
                department_id: this.data.dept,
                subdepartment_id: JSON.parse(this.data.subdept),
                location_id: this.data.loc
            }
            console.log(postdata)
            if (postdata.department_id == "") {
                delete postdata.department_id;
            }
            if (postdata.subdepartment_id == "") {
                delete postdata.subdepartment_id;
            }
            if (postdata.location_id == "") {
                delete postdata.location_id;
            }
            console.log(postdata);
            if (this.data.dept == "" && this.data.subdept == "" && this.data.loc == "") {
                let alert = this.alertCtrl.create({
                    title: 'Alert!',
                    subTitle: 'Please select atleast one field',
                    buttons: ['Ok']
                });
                alert.present();
            } else {
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                let options = new RequestOptions({headers: headers});
                this.http.post(this.baseurlprovider.base_url + 'jobs/filter.json', postdata, options)
                    .map(res => res.json())
                    .subscribe((response) => {
                        console.log(response);
                        if (response.response.status == true) {
                            for (let dd of response.response.data) {
                                this.lists.push(dd);
                            }
                            this.viewCtrl.dismiss(this.lists);
                        } else {
                            this.viewCtrl.dismiss(this.lists);
                        }
                    })
            }
        } else {
            var post = {
                department_id: this.data.dept,
                subdepartment_id: this.data.subdept,
                location_id: this.data.loc
            }
            console.log(post)
            if (post.department_id == "") {
                delete post.department_id;
            }
            if (post.subdepartment_id == "") {
                delete post.subdepartment_id;
            }
            if (post.location_id == "") {
                delete post.location_id;
            }
            console.log(post);
            if (this.data.dept == "" && this.data.subdept == "" && this.data.loc == "") {
                let alert = this.alertCtrl.create({
                    title: 'Alert!',
                    subTitle: 'Please select atleast one field',
                    buttons: ['Ok']
                });
                alert.present();
            } else {
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                let options = new RequestOptions({headers: headers});
                this.http.post(this.baseurlprovider.base_url + 'jobs/filter.json', post, options)
                    .map(res => res.json())
                    .subscribe((response) => {
                        console.log(response);
                        if (response.response.status == true) {
                            this.lists=response.response.data;
                            console.log('filterpage typeof');
                            console.log(typeof(this.lists));
//                            for (let dd of response.response.data) {
//                                this.lists.push(dd);
//                            }
                            this.viewCtrl.dismiss(this.lists);
                        } else {
                            this.viewCtrl.dismiss(this.lists);
                        }
                    })
            }
        }
    }


}
