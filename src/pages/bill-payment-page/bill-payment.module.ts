import { NgModule } from '@angular/core';
import { billPaymentPage } from './bill-payment'
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [billPaymentPage],
  imports: [IonicPageModule.forChild(billPaymentPage)],
})
export class BillPaymentModule { }