import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class ChargeKioosk {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'chargePage';

  pages: Array<{title: string, component: any}>;

  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
    { title: 'خرید شارژ (همه اپراتورها)', component: 'chargePage' },
    { title: 'بسته‌های اینترنتی ایرانسل', component: 'packagePage' },
    { title: 'پرداخت قبض و جرایم رانندگی', component: 'billPage' },
    { title: 'خرید گیفت کارت', component: 'giftcardPage' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.platform.registerBackButtonAction(function () {
        
      // }, 100);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
