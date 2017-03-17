import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { DataProvider } from '../providers/data.provider';
import { PaymentLinkProvider } from '../providers/payment-link.provider';
import { TrafficPipe } from '../pipes/traffic.pipe';
import { CustomerPipe } from '../pipes/customer.pipe';
import { TimePipe } from '../pipes/time.pipe';
import { TrafficDetailPipe } from '../pipes/traffic-detail.pipe';
import { FilterPackages } from '../pipes/filter-packages.pipe';
import { MyApp } from './app.component';
import { chargePage } from '../pages/charge-page/charge-page.component';
import { packagePage } from '../pages/packages-page/packages.component';
import { billPage } from '../pages/bill-page/bill.component';
import { giftcardPage } from '../pages/giftcard-page/giftcard.component';

@NgModule({
  declarations: [
    TrafficPipe,
    CustomerPipe,
    TimePipe,
    TrafficDetailPipe,
    FilterPackages,
    MyApp,
    chargePage,
    packagePage,
    billPage,
    giftcardPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    chargePage,
    packagePage,
    billPage,
    giftcardPage,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    PaymentLinkProvider
  ]
})
export class AppModule {}
