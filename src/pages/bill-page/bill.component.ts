import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Platform } from 'ionic-angular'
import { NavController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { Validators, FormControl, FormGroup} from '@angular/forms'

@IonicPage()
@Component({
	selector: 'pay-bill',
	templateUrl: 'bill.template.html'
})

export class billPage {
	private billForm : FormGroup;

	constructor(
			private platform: Platform,
			private androidPermissions: AndroidPermissions,
			private barcodeScanner: BarcodeScanner,
			private navCtrl: NavController,
		){
		this.platform = platform;
	}

	ionViewWillLoad() {
		this.billForm = new FormGroup({
			bill_id: new FormControl('', Validators.required),
			payment_id: new FormControl('', Validators.required),
		});
	}

	scan() {
        this.platform.ready().then(() => {
        	this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
				success => {
					console.log('Permission granted');
					this.barcodeScanner.scan(
		            	{
		            		formats : "CODE_128",
		            		prompt : "لطفا بارکد قبض را مقابل دوربین قرار دهید."
		            	}
	            	).then((result) => {
			            	console.log(result.text);
							this.billForm.controls['bill_id'].setValue(result.text.slice(0,13));
							this.billForm.controls['payment_id'].setValue(result.text.slice(13,-1));
			            }, (error) => {
			                console.log(error);
			            }
		            );
				},
				err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.CAMERA)
			);
        });
    }

	onSubmit(values){
		console.log(values);
		this.navCtrl.push('billPaymentPage', {
	      values: values,
	    });
	}
}