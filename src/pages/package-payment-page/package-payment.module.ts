import { NgModule } from '@angular/core';
import { packagePaymentPage } from './package-payment'
import { PipesModule } from '../../pipes/pipes.module';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
	declarations: [packagePaymentPage],
	imports: [
		IonicPageModule.forChild(packagePaymentPage),
		PipesModule
	],
	exports: [
		packagePaymentPage
	],
})
export class PackagePageModule { }