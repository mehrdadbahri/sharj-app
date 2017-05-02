import { NgModule } from '@angular/core';
import { giftcardPage } from './giftcard.component'
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [giftcardPage],
  imports: [IonicPageModule.forChild(giftcardPage)],
})
export class GiftCardPageModule { }