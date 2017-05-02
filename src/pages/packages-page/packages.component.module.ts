import { NgModule } from '@angular/core';
import { packagePage } from './packages.component'
import { PipesModule } from '../../pipes/pipes.module';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
	declarations: [packagePage],
	imports: [
		IonicPageModule.forChild(packagePage),
		PipesModule
	],
})
export class ChargePageModule { }