import { NgModule } from '@angular/core';
import { chargePage } from './charge-page.component'
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [chargePage],
  imports: [IonicPageModule.forChild(chargePage)],
})
export class ChargePageModule { }