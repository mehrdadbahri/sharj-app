import { Component } from '@angular/core';
import { Platform } from 'ionic-angular'
import { BarcodeScanner } from 'ionic-native'
import { Validators, FormControl, FormGroup} from '@angular/forms'

@Component({
	selector: 'pay-bill',
	templateUrl: 'bill.template.html'
})

export class billPage {
	private billForm : FormGroup;

	constructor(private platform: Platform){
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
			payment_gateway: new FormControl('Mellat', Validators.required)
		});
	}

	scan() {
        this.platform.ready().then(() => {
            BarcodeScanner.scan().then((result) => {
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