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

  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
    ) {
    this.initializeApp();

    this.pages = [
      { title: 'خرید شارژ (همه اپراتورها)', component: 'chargePage' },
      { title: 'بسته‌های اینترنتی ایرانسل', component: 'packagePage' },
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
      this.nav.setRoot(page.component);
  }

  submitComment(){
      let PACKAGE_NAME : String = 'com.ionicframework.KiooskSharj';
      const options = {
      action: window['plugins'].intentShim.ACTION_EDIT,
      url: 'bazaar://details?id=' + PACKAGE_NAME,
      package: 'com.farsitel.bazaar'
      };
       window['plugins'].intentShim.startActivity(options, function() {}, function() {alert('Failed to open URL via Android Intent')});
    }
}
