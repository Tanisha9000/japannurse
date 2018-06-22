import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BaseurlapiProvider} from '../../providers/baseurlapi/baseurlapi';
import {File} from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';

@IonicPage()
@Component({
    selector: 'page-pdf',
    templateUrl: 'pdf.html',
})
export class PdfPage {

    url: string;
    allpdfs: any = [];
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        private baseurlprovider: BaseurlapiProvider,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private transfer: FileTransfer,
        private file: File) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PdfPage');
        this.getPdf();
    }

    getPdf() {
        console.log('entered')
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers: headers});
        this.http.get(this.baseurlprovider.base_url + 'pdfs/index.json', options)
            .map(res => res.json())
            .subscribe(response => {
                loading.dismiss();
                console.log(response)
                if (response.response.status == true) {
                    this.url = 'http://simerjit.gangtask.com/japannurse/';
                    for (let i of response.response.data) {
                        this.allpdfs.push({dlink: this.url + "" + i.file, restdata: i});
                    }
                    console.log(this.allpdfs)
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
    download(link, filee) {
        console.log(link)
        console.log(filee)
        let split = filee.split('/')
        console.log(split)
        const fileTransfer: FileTransferObject = this.transfer.create();
        const url = link;
        this.file.checkDir(this.file.externalRootDirectory, 'Japanurse').then(response => {
            alert('Directory exists' + JSON.stringify(response))
            console.log('Directory exists' + response)
            fileTransfer.download(url, this.file.externalRootDirectory + '/Japanurse/' + split[2], true).then((entry) => {
                alert(entry)
                alert(JSON.stringify(entry))
                alert(entry.toURL())
                if (entry.toURL()) {
                    let toast = this.toastCtrl.create({
                        message: 'Download is complete',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                }
                console.log('download complete: ' + entry.toURL());
            }).catch((error) => {
                alert(error)
                alert(JSON.stringify(error))
                // handle error
            });

        }).catch(err => {
            alert(err)
            console.log('Directory doesnt exist')
            this.file.createDir(this.file.externalRootDirectory, 'Japanurse', true).then(res => {
                alert(res)
                alert(JSON.stringify(res))
                fileTransfer.download(url, this.file.externalRootDirectory + '/Japanurse/' + split[2], true).then((entry) => {
                    alert(entry)
                    alert(JSON.stringify(entry))
                    alert(entry.toURL())
                    if (entry.toURL()) {
                        let toast = this.toastCtrl.create({
                            message: 'Download is completed',
                            duration: 3000,
                            position: 'top'
                        });
                        toast.present();
                    }
                    console.log('download complete: ' + entry.toURL());
                }).catch((error) => {
                    alert(error)
                    alert(JSON.stringify(error))
                    // handle error
                });

            }).catch((err1) => {
                alert('couldnt create directory' + JSON.stringify(err1));
            })
        });

    }

}
