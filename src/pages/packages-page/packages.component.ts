import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Platform, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormControl, FormGroup} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact } from '@ionic-native/contacts';
import { PaymentLinkProvider } from '../../providers/payment-link.provider';
import { DataProvider } from '../../providers/data.provider'
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
	selector: 'buy-package',
	templateUrl: 'packages.template.html'
})
export class packagePage {
	// @ViewChild(Content) content: Content;
	private packageType : String = 'regular';
	private customerType : String = 'prepaid';
	private packageForm : FormGroup;
	private packages : Object;
	private awesomePackages : Object[];
	private packageList : Object[] = [];
	private hourlyCheckbox : Boolean = false;
	private dailyCheckbox : Boolean = false;
	private weeklyCheckbox : Boolean = true;
	private monthlyCheckbox : Boolean = false;
	private dataReady : string = 'loading';
	private showForm : boolean = false;
	private selectedPackage : Object;
	private saveContact : Boolean = true;

	constructor(
		private dataService: DataProvider,
		private platform : Platform,
		private paymentService : PaymentLinkProvider,
		private loadingCtrl : LoadingController,
		private alertCtrl : AlertController,
		private storage : Storage,
		private contacts : Contacts,
		private iab: InAppBrowser
		) {
	}

	ionViewWillLoad() {
		this.packageForm = new FormGroup({
			phone_number: new FormControl('', 
				Validators.compose([
					Validators.minLength(11),
					Validators.pattern('^[09]{2}[0-9]{9}$'),
					Validators.required 
					])),
			payment_gateway: new FormControl('Saman', Validators.required)
		});
		this.storage.get('phone').then((val) => {
			(<FormControl>this.packageForm.controls['phone_number']).setValue(val);
		})
	}

	ionViewDidLoad(){
		this.getPackagesList();
	}

	getPackagesList(){
		this.dataService.getPackages()
		.map(res => res.json(), err => err)
		.subscribe(data => {
			let packages : Object = data.products.internetPackage.mtn;
			if(packages) {
				// code...
				this.packages = packages;
				this.awesomePackages = packages['اینترنت ایرانسل شگفت انگیز'];
				let key : string;
				let k : string;
				let temp : Object[] = []
				for (key in packages){
					if(!key.includes("شگفت انگیز")) {
						for (k in packages[key]){
							temp.push(packages[key][k]);
						}
					}
				}
				this.packageList = temp;
				let timeoutId = setTimeout(() => {  
					this.dataReady = 'ready';
				}, 1000);
				
				// console.log(this.packageList);
			}
			else {
				let timeoutId = setTimeout(() => {  
					this.dataReady = 'error';
				}, 1000);
				console.log('error!!!!!!!');
			}
		},
		err => {
			let timeoutId = setTimeout(() => {  
				this.dataReady = 'error';
			}, 1000);
			console.log(err);
		});
	}
	onSearchContactClick(input : any){
		this.contacts.pickContact().then(
			(contact: Contact) => {
				if (contact.phoneNumbers){
					input.value = contact.phoneNumbers[0];
					this.saveContact = false;
				}
			}, (error: any) => {
				console.log("error in picking contact!");
				console.log(error)
			}
			);
	}

	onSubmit(values){
		let loader = this.loadingCtrl.create({
			spinner: 'circles',
			content: `
			<h2>درحال ایجاد لینک پرداخت</h2>`});
		loader.present();
		let platformName : string = 'Script';
		if(this.platform.is('ios')) {
			platformName = 'IOS';
		}
		else if(this.platform.is('android')) {
			platformName = 'Android';
		}
		if(this.saveContact) 
			this.storage.set('phone', values.phone_number);
		this.paymentService.internetRecharge(this.selectedPackage['id'], values.phone_number, values.payment_gateway, platformName)
		.map((res : Response) => res.json())
		.subscribe((result : any) => {
			loader.dismiss();
			if(result.status == 'Success') {
				console.log(result.paymentInfo.url);
				const browser = this.iab.create(result.paymentInfo.url, '_blank', 'location=true');
				browser.show();
			}
			else if(result.status == 'Error') {
				let alert = this.alertCtrl.create({
					title: 'خطا',
					subTitle: result.errorMessage,
					buttons: ['OK']
				});
				alert.present();
			}
		},
		(err : any) => {
			loader.dismiss();
			console.log(err);
			let alert = this.alertCtrl.create({
				title: 'خطا',
				subTitle: `خطایی در ارتباط با سرور رخ داده است, 
				لطفا از اتصال اینترنت خود مطمئن شوید و دوباره امتحان کنید`,
				buttons: ['OK']
			});
			alert.present();
		});
	}
}