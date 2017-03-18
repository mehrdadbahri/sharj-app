import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentLinkProvider {
	private webserviceID : string;

	constructor(public http: Http) {
		this.webserviceID = '587ceaef-4ee0-46dd-a64e-31585bef3768';
	}

	topup(
		type : string,
		amount : string,
		phone_number : string,
		gateway : string,
		platform : string
		) {
		let data : Object = {
			'type' : type,
			'amount' : amount+'',
			'cellphone' : phone_number,
			'webserviceId' : this.webserviceID,
			'issuer' : gateway,
			'scriptVersion' : platform,
			'firstOutputType' : 'json',
			'secondOutputType' : 'view',
			'redirectToPage' : 'False'

		};
		let url : string = 'http://localhost:8100/api/services/v3/EasyCharge/topup';
		let headers = new Headers({'Content-Type':'application/json'});
		let options = new RequestOptions({ headers: headers});
		return this.http.post(url, JSON.stringify(data), options);
	}

	product(
		productId : string,
		phone_number : string,
		gateway : string,
		platform : string
		) {
		let data : Object = {
			'productId' : productId,
			'cellphone' : phone_number,
			'webserviceId' : this.webserviceID,
			'issuer' : gateway,
			'scriptVersion' : platform,
			'firstOutputType' : 'json',
			'secondOutputType' : 'view',
			'redirectToPage' : 'False'

		};
		let url : string = 'http://localhost:8100/api/services/v3/EasyCharge/BuyProduct';
		let headers = new Headers({'Content-Type':'application/json'});
		let options = new RequestOptions({ headers: headers});
		return this.http.post(url, JSON.stringify(data), options);
	}

	internetRecharge(
		packageId : string,
		phone_number : string,
		gateway : string,
		platform : string
		) {
		let data : Object = {
			'packageId' : packageId,
			'cellphone' : phone_number,
			'webserviceId' : this.webserviceID,
			'issuer' : gateway,
			'scriptVersion' : platform,
			'firstOutputType' : 'json',
			'secondOutputType' : 'view',
			'redirectToPage' : 'False'

		};
		let url : string = 'http://localhost:8100/api/services/v3/EasyCharge/internetRecharge';
		let headers = new Headers({'Content-Type':'application/json'});
		let options = new RequestOptions({ headers: headers});
		return this.http.post(url, JSON.stringify(data), options);
	}

}
