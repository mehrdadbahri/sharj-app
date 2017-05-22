import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data.provider'
import { packagePaymentPage } from '../package-payment-page/package-payment'
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
	selector: 'buy-package',
	templateUrl: 'packages.template.html',
})
export class packagePage {
	// @ViewChild(Content) content: Content;
	private packageType : String = 'regular';
	private customerType : String = 'prepaid';
	private packages : Object;
	private awesomePackages : Object[];
	private packageList : Object[] = [];
	private hourlyCheckbox : Boolean = false;
	private dailyCheckbox : Boolean = false;
	private weeklyCheckbox : Boolean = false;
	private monthlyCheckbox : Boolean = true;
	private dataReady : string = 'loading';

	constructor(
		private dataService: DataProvider,
		private navCtrl: NavController,
		) {
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

	onPackageSelected(item){
		this.navCtrl.push('packagePaymentPage', {
	      item: item,
	      packageType: this.packageType,
	    });
	}
}