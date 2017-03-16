import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {

	constructor(public http: Http) {

	}

	getPackages() {
		return new Promise<Object>(resolve => {
			this.http.get('http://localhost:8100/api/services/v3/EasyCharge/initializeData')
			.map(res => res.json())
			.subscribe(data => {
				var packages : Object = data.products.internetPackage.mtn;
				resolve(packages);
			},
			err => {
				resolve(err);
			});
		});
	}

	getGiftcards() {
		return new Promise<Object>(resolve => {
			this.http.get('http://localhost:8100/api/services/v3/EasyCharge/initializeData')
			.map(res => res.json())
			.subscribe(data => {
				var giftcards : Object = data.products.giftCard;
				resolve(giftcards);
			},
			err => {
				resolve(err);
			});
		});
	}

}
