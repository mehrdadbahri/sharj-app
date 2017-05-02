import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Platform } from 'ionic-angular'
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { Storage } from '@ionic/storage';
import { Validators, FormControl, FormGroup} from '@angular/forms'

@IonicPage()
@Component({
	selector: 'pay-bill',
	templateUrl: 'bill.template.html'
})

export class billPage {
	private billForm : FormGroup;

	constructor(private platform: Platform, private storage : Storage, private barcodeScanner: BarcodeScanner){
		this.platform = platform;
	}

	ionViewWillLoad() {
		this.billForm = new FormGroup({
			phone_number: new FormControl('', 
				Validators.compose([
				Validators.minLength(11),
				Validators.pattern('^[09]{2}[0-9]{9}$'),
				Validators.required
				])),
			bill_id: new FormControl('', Validators.required),
			payment_id: new FormControl('', Validators.required),
			payment_gateway: new FormControl('Saman', Validators.required)
		});
		this.storage.get('phone').then((val) => {
			(<FormControl>this.billForm.controls['phone_number']).setValue(val);
		})
	}

	scan() {
        this.platform.ready().then(() => {
            this.barcodeScanner.scan().then((result) => {
            	console.log(result.text);
                (<FormControl>this.billForm.controls['payment_id']).setValue(result.text);
            }, (error) => {
                console.log(error);
            });
        });
    }

	onSubmit(values){
		console.log(values)
	}
}