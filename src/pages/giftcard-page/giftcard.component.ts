import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Platform, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormControl, FormGroup} from '@angular/forms';
import { DataProvider } from '../../providers/data.provider'
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact } from '@ionic-native/contacts';
import { PaymentLinkProvider } from '../../providers/payment-link.provider';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
	selector: 'buy-giftcard',
	templateUrl: 'giftcard.template.html'
})
export class giftcardPage {
	private giftcards : Object[];
	private giftcardForm : FormGroup;
	private dataStatus : string = 'loading';
	private showForm : boolean = false;
	private selectedGiftcard : Object;
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
		this.giftcardForm = new FormGroup({
			phone_number: new FormControl('', 
				Validators.compose([
					Validators.minLength(11),
					Validators.pattern('^[09]{2}[0-9]{9}$'),
					Validators.required 
					])),
			payment_gateway: new FormControl('Saman', Validators.required)
		});
		this.storage.get('phone').then((val) => {
			(<FormControl>this.giftcardForm.controls['phone_number']).setValue(val);
		})
	}

	ionViewDidLoad(){
		this.getGiftcardsList();

	}
	getGiftcardsList(){
		this.dataService.getGiftcards()
		.map(res => res.json())
		.subscribe(data => {
			let giftcards : Object = data.products.giftCard;
			if(giftcards) {
				let key : string;
				let k : string;
				let temp : Object[] = []
				for (key in giftcards){
					for (k in giftcards[key]){
						if (giftcards[key][k].id.toLowerCase().includes('itunes'))
							giftcards[key][k].imgSrc = 'assets/images/itunes.png';
						else if (giftcards[key][k].id.toLowerCase().includes('googleplay')){
							giftcards[key][k].imgSrc = 'assets/images/google-play.png';
							giftcards[key][k].name = giftcards[key][k].name.replace('پلی ', '');
						}
						else if (giftcards[key][k].id.toLowerCase().includes('microsoft'))
							giftcards[key][k].imgSrc = 'assets/images/microsoft.png';
						else if (giftcards[key][k].id.toLowerCase().includes('amazon'))
							giftcards[key][k].imgSrc = 'assets/images/amazon.png';
						else if (giftcards[key][k].id.toLowerCase().includes('xbox'))
							giftcards[key][k].imgSrc = 'assets/images/xbox.png';
						else if (giftcards[key][k].id.toLowerCase().includes('playstationplus'))
							giftcards[key][k].imgSrc = 'assets/images/playstation+.png';
						else if (giftcards[key][k].id.toLowerCase().includes('playstation')){
							giftcards[key][k].name = giftcards[key][k].name.replace('Network', '');
							giftcards[key][k].imgSrc = 'assets/images/playstation.png';
						}
						temp.push(giftcards[key][k]);
					}
				}
				this.giftcards = temp;
				let timeoutId = setTimeout(() => {  
					this.dataStatus = 'ready';
				}, 1000);
				// console.log(this.packageList);
			}
			else {
				let timeoutId = setTimeout(() => {  
					this.dataStatus = 'error';
				}, 1000);
				console.log('error!!!!!!!');
			}
		},
		err => {
			let timeoutId = setTimeout(() => {  
				this.dataStatus = 'error';
			}, 1000);
			console.log('error!!!!!!!');
		});
	}

	onSearchContactClick(){
		this.contacts.pickContact().then(
			(contact: Contact) => {
				let selectedNumber : String;
				if (contact.phoneNumbers){
					if (contact.phoneNumbers.length > 1){
						let alert = this.alertCtrl.create();
					    alert.setTitle('انتخاب شماره');
					    for (let number of contact.phoneNumbers){
					    	alert.addInput({
						      type: 'radio',
						      label: number.value.replace(/ /g,''),
						      value: number.value.replace(/ /g,''),
						    });
					    }
					    alert.addButton('انصراف');
					    alert.addButton({
					      text: 'تایید',
					      handler: data => {
					        selectedNumber = data;
					        this.giftcardForm.controls['phone_number'].setValue(selectedNumber)
							this.saveContact = false;
					      }
					    });
					    alert.present();
					}
					else if (contact.phoneNumbers.length == 1) {
						selectedNumber = contact.phoneNumbers[0].value.replace(/ /g,'');
						this.giftcardForm.controls['phone_number'].setValue(selectedNumber)
						this.saveContact = false;
					}
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
		this.paymentService.product(this.selectedGiftcard['id'], values.phone_number, values.payment_gateway, platformName)
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
