import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormControl, FormGroup} from '@angular/forms'

@IonicPage()
@Component({
	selector: 'bill-payment',
	templateUrl: 'bill-payment.template.html'
})

export class billPaymentPage {
	private billForm : FormGroup;

	constructor(
			private storage : Storage,
			private navCtrl: NavController,
			private navParams: NavParams,
		){

	}

	ionViewWillLoad() {
		this.billForm = new FormGroup({
			phone_number: new FormControl('', 
				Validators.compose([
				Validators.minLength(11),
				Validators.pattern('^[09]{2}[0-9]{9}$'),
				Validators.required
				])),
			payment_gateway: new FormControl('Saman', Validators.required)
		});
		this.storage.get('phone').then((val) => {
			this.billForm.controls['phone_number'].setValue(val);
		})
	}

	onSubmit(values){
		console.log(values)
	}

	onCancelClicked(){
		this.navCtrl.pop();
	}
}