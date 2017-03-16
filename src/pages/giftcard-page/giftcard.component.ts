import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data.provider'

@Component({
	selector: 'buy-giftcard',
	templateUrl: 'giftcard.template.html'
})
export class giftcardPage {
	private giftcards : Object[];

	constructor(private dataService: DataProvider) {
	}

	ionViewDidLoad(){
		this.dataService.getGiftcards().then(giftcards => {
			if(giftcards) {
				let key : string;
				let k : string;
				let temp : Object[] = []
				for (key in giftcards){
					for (k in giftcards[key]){
						if (giftcards[key][k].id.toLowerCase().includes('itunes'))
							giftcards[key][k].imgSrc = '/assets/images/itunes.png';
						else if (giftcards[key][k].id.toLowerCase().includes('googleplay'))
							giftcards[key][k].imgSrc = '/assets/images/google-play.png';
						else if (giftcards[key][k].id.toLowerCase().includes('microsoft'))
							giftcards[key][k].imgSrc = '/assets/images/microsoft.png';
						else if (giftcards[key][k].id.toLowerCase().includes('amazon'))
							giftcards[key][k].imgSrc = '/assets/images/amazon.png';
						else if (giftcards[key][k].id.toLowerCase().includes('xbox'))
							giftcards[key][k].imgSrc = '/assets/images/xbox.png';
						else if (giftcards[key][k].id.toLowerCase().includes('playstationplus'))
							giftcards[key][k].imgSrc = '/assets/images/playstation+.png';
						else if (giftcards[key][k].id.toLowerCase().includes('playstation')){
							giftcards[key][k].name = giftcards[key][k].name.replace('Network', '');
							giftcards[key][k].imgSrc = '/assets/images/playstation.png';
						}
						temp.push(giftcards[key][k]);
					}
				}
				this.giftcards = temp;
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
