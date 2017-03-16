import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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
	) : Promise<string> {
		return new Promise<string>(resolve => {
			let json : Object = {
				'type' : type,
				'amount' : amount,
				'cellphone' : phone_number,
				'webserviceId' : this.webserviceID,
				'issuer' : gateway,
				'scriptVersion' : platform,
				'firstOutputType' : 'json',
				'secondOutputType' : 'view',
				'redirectToPage' : 'False'

			};
			let data : string = JSON.stringify(json);
			console.log(data);
			let url : string = 'http://localhost:8100/api/services/v3/EasyCharge/topup';
			this.http.post(url, data)
			.map(res => res.json())
			.subscribe(result => {
				result = JSON.parse(result);
				if(result.status == 'Success') {
					resolve(result.paymentInfo.url);
				}
			},
			err => {
				resolve(err);
			});
		});
	}

}
