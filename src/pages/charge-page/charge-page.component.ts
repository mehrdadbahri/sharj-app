import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { FocusEvent } from '@angular/event';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact } from '@ionic-native/contacts';
import { Platform, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormControl, FormGroup} from '@angular/forms';
import { PaymentLinkProvider } from '../../providers/payment-link.provider';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
	selector: 'buy-charge',
	templateUrl: 'charge-page.template.html'
})
export class chargePage {
	private showSearchIcon : boolean = true;
	private chargeType : String = "direct";
	private chargeForm : FormGroup;
	private chargeAmounts : Object[] = [
	{'name': '۱۰۰۰ تومان', 'value': 1000},
	{'name': "۲۰۰۰ تومان", 'value': 2000},
	{'name': "۵۰۰۰ تومان", 'value': 5000},
	{'name': "۱۰۰۰۰ تومان", 'value': 10000},
	{'name': "۲۰۰۰۰ تومان", 'value': 20000}
	]
	private operators : Object[] = [
	{'name': 'ایرانسل', 'value': 'MTN'},
	{'name': 'همراه اول', 'value': 'MCI'},
	{'name': 'رایتل', 'value': 'RTL'}
	]
	private selectedOperator : Object = this.operators[0];
	private saveContact : Boolean = true;

	constructor(
		private platform : Platform,
		private paymentService : PaymentLinkProvider,
		private loadingCtrl : LoadingController,
		private alertCtrl : AlertController,
		private storage : Storage,
		private contacts : Contacts,
		private iab: InAppBrowser
		){

	}

	ionViewWillLoad() {
		this.chargeForm = new FormGroup({
			phone_number: new FormControl('', 
				[
					Validators.minLength(11),
					Validators.pattern('((09)|(\\+?989))[0-9]{9}'),
					Validators.required
				]),
			operator: new FormControl('MTN', Validators.required),
			amount: new FormControl(2000, Validators.required),
			awesome: new FormControl(false, Validators.required),
			payment_gateway: new FormControl('Saman', Validators.required)
		});
		this.storage.get('phone').then((val) => {
        	(<FormControl>this.chargeForm.controls['phone_number']).setValue(val);
       })
	}

	onPhoneInputFocusout(event : FocusEvent){
		var input : any = event.target;
		if (!input.value){
			this.showSearchIcon = true;
		}
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
					        this.chargeForm.controls['phone_number'].setValue(selectedNumber)
							this.saveContact = false;
					      }
					    });
					    alert.present();
					}
					else if (contact.phoneNumbers.length == 1) {
						selectedNumber = contact.phoneNumbers[0].value.replace(/ /g,'');
						this.chargeForm.controls['phone_number'].setValue(selectedNumber)
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
		let chargeCode : string;
		if(this.chargeType == 'direct') {
			if(this.saveContact) 
				this.storage.set('phone', values.phone_number);
			chargeCode = this.getOperator(values.phone_number);
			if(values.awesome) {
				chargeCode = chargeCode.concat('!');
			}
			this.paymentService.topup(chargeCode, values.amount, values.phone_number, values.payment_gateway, platformName,)
			.map((res : Response) => res.json())
			.subscribe((result : any) => {
				loader.dismiss();
				if(result.status == 'Success') {
					var options = {
				      location: 'yes',
				      zoom: 'no',
				    };
					const browser = this.iab.create(result.paymentInfo.url, '_blank', "location=yes,zoom=no");
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
		else {
			if(this.selectedOperator['value'] == 'RTL' && values.amount == 1000) {
				loader.dismiss();
				let alert = this.alertCtrl.create({
					title: 'خطا',
					subTitle: 'خرید کارت شارژ ۱۰۰۰ تومانی برای اپراتور رایتل امکان پذیر نمی باشد.',
					buttons: ['OK']
				});
				alert.present();
				return;
			}
			chargeCode = 'CC-';
			chargeCode = chargeCode.concat(this.selectedOperator['value']);
			chargeCode = chargeCode.concat('-');
			chargeCode = chargeCode.concat(values.amount+'');
			this.paymentService.product(chargeCode, values.phone_number, values.payment_gateway, platformName)
			.map((res : Response) => res.json())
			.subscribe((result : any) => {
				loader.dismiss();
				if(result.status == 'Success') {
					console.log(result.paymentInfo.url);
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
					subTitle: `خطایی در برقراری ارتباط با سرور رخ داده است, 
					لطفا از اتصال اینترنت خود مطمئن شوید و دوباره امتحان کنید`,
					buttons: ['OK']
				});
				alert.present();
			});
		}

	}

	getOperator(number : string){
		if(number.startsWith('093') || number.startsWith('090')) {
			return 'MTN';
		}
		else if(number.startsWith('094')) {
			return 'WiMax';
		}
		else if(number.startsWith('091') || number.startsWith('0990')) {
			return 'MCI';
		}
		else if(number.startsWith('0921') || number.startsWith('0922')) {
			return 'RTL';
		}
	}
}
