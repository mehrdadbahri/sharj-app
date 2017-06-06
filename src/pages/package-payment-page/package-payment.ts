import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Platform, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormControl, FormGroup} from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact } from '@ionic-native/contacts';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PaymentLinkProvider } from '../../providers/payment-link.provider';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
	selector: 'pay-package',
	templateUrl: 'package-payment.template.html'
})
export class packagePaymentPage {
	// @ViewChild(Content) content: Content;
	private packageForm : FormGroup;
	private saveContact : Boolean = true;
	private selectedPackage : Object;
	private packageType : String;

	constructor(
		private platform : Platform,
		private paymentService : PaymentLinkProvider,
		private alertCtrl : AlertController,
		private loadingCtrl : LoadingController,
		private storage : Storage,
		private contacts : Contacts,
		private iab: InAppBrowser,
		private navCtrl: NavController,
		private navParams: NavParams,
		private diagnostic: Diagnostic,
		) {

		this.selectedPackage = navParams.get('item');
		this.packageType = navParams.get('packageType');
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

	onSearchContactClick(){
		this.diagnostic.isContactsAuthorized().then(authorised => {
            if (authorised) {
                this.getContact();
            }
            else {
                this.diagnostic.requestContactsAuthorization().then(authorisation => {
                    if(authorisation == this.diagnostic.permissionStatus.GRANTED){
                    	this.getContact();
                    }
                });
            }
        });
	}

	getContact(){
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
					        this.packageForm.controls['phone_number'].setValue(selectedNumber)
							this.saveContact = false;
					      }
					    });
					    alert.present();
					}
					else if (contact.phoneNumbers.length == 1) {
						selectedNumber = contact.phoneNumbers[0].value.replace(/ /g,'');
						this.packageForm.controls['phone_number'].setValue(selectedNumber)
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
		this.paymentService.internetRecharge(this.selectedPackage['id'], values.phone_number, values.payment_gateway, platformName)
		.map((res : Response) => res.json())
		.subscribe((result : any) => {
			loader.dismiss();
			if(result.status == 'Success') {
				const browser = this.iab.create(result.paymentInfo.url, '_system');
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
	onCancelClicked(){
		this.navCtrl.pop();
	}
}