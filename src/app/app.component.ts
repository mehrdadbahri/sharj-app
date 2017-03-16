import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { chargePage } from '../pages/charge-page/charge-page.component';
import { packagePage } from '../pages/packages-page/packages.component';
import { billPage } from '../pages/bill-page/bill.component'
import { giftcardPage } from '../pages/giftcard-page/giftcard.component'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = chargePage;

  pages: Array<{title: string, component: any}>;

  constructor(private platform: Platform) {
    // this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'خرید شارژ', component: chargePage },
      { title: 'بسته‌های اینترنتی ایرانسل', component: packagePage },
      { title: 'پرداخت قبض و جرایم رانندگی', component: billPage },
      { title: 'خرید گیفت کارت', component: giftcardPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
