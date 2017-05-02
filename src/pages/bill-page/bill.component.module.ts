import { NgModule } from '@angular/core';
import { billPage } from './bill.component'
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [billPage],
  imports: [IonicPageModule.forChild(billPage)],
})
export class BillPageModule { }