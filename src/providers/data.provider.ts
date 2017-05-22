import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {

	constructor(public http: Http) {

	}

	getPackages() {
		// return this.http.get('https://chr724.ir/services/v3/EasyCharge/initializeData');
		return this.http.get('http://localhost:8100/api/services/v3/EasyCharge/initializeData');

	}

	getGiftcards() {
		// return this.http.get('https://chr724.ir/services/v3/EasyCharge/initializeData');
		return this.http.get('http://localhost:8100/api/services/v3/EasyCharge/initializeData');
	}

}
