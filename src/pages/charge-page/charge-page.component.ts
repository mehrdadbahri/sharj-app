import { Component } from '@angular/core';
import { FocusEvent } from '@angular/event'
import { Contacts, Contact } from 'ionic-native'
import { Platform } from 'ionic-angular'
import { Validators, FormControl, FormGroup} from '@angular/forms'
import { PaymentLinkProvider } from '../../providers/payment-link.provider'

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

	constructor(private platform : Platform, private paymentService : PaymentLinkProvider){

	}

	ionViewWillLoad() {
		this.chargeForm = new FormGroup({
			phone_number: new FormControl('09355511587', 
				Validators.compose([
				Validators.minLength(11),
				Validators.pattern('^[09]{2}[0-9]{9}$'),
				Validators.required 
				])),
			operator: new FormControl('MTN', Validators.required),
			amount: new FormControl(2000, Validators.required),
			awesome: new FormControl(false, Validators.required),
			payment_gateway: new FormControl('Mellat', Validators.required)
		});
	}

	onPhoneInputFocusout(event : FocusEvent){
		var input : any = event.target;
		if (!input.value){
			this.showSearchIcon = true;
		}
	}

	onSearchContactClick(input : any){
		Contacts.pickContact().then(
			(contact: Contact) => {
				if (contact.phoneNumbers){
					input.value = contact.phoneNumbers[0];
				}
			}, (error: any) => {
				console.log("error in picking contact!");
				console.log(error)
			}
			);
	}

	onSubmit(values){
		let chargeType : string = this.getOperator(values.phone_number);
		if(values.awesome) {
			chargeType = chargeType.concat('!');
		}
		let platformName : string = 'Script';
		if(this.platform.is('ios')) {
			platformName = 'IOS';
		}
		else if(this.platform.is('android')) {
			platformName = 'Android';
		}
		this.paymentService.topup(
			chargeType,
			values.amount,
			values.phone_number,
			values.payment_gateway,
			platformName
		).then(url => {
			console.log(url);
		});
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
