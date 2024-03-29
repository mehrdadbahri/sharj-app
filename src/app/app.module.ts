import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact } from '@ionic-native/contacts';
import { WebIntent } from '@ionic-native/web-intent';
import { Diagnostic } from '@ionic-native/diagnostic';
import { DataProvider } from '../providers/data.provider';
import { PaymentLinkProvider } from '../providers/payment-link.provider';
import { ChargeKioosk } from './app.component';

@NgModule({
  declarations: [
    ChargeKioosk,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ChargeKioosk),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChargeKioosk,
  ],
  providers: [
    InAppBrowser,
    Contacts,
    Contact,
    StatusBar,
    SplashScreen,
    WebIntent,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    PaymentLinkProvider
  ]
})
export class AppModule {}
