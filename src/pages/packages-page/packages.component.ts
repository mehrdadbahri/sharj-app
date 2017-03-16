import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data.provider'

@Component({
	selector: 'buy-package',
	templateUrl: 'packages.template.html'
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
	private weeklyCheckbox : Boolean = true;
	private monthlyCheckbox : Boolean = false;


	constructor(private dataService: DataProvider) {
	}

	ionViewDidLoad(){
		this.dataService.getPackages().then(packages => {
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
				// console.log(this.packageList);
			}
			else{
				console.log('error!!!!!!!');
			}
		}).catch(err => {
			console.log('error in connecting to server!');
		});
	}
}