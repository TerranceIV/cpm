import { NgModule } from '@angular/core';
import { AllComponent } from './all/all';
import { MenuComponent } from './menu/menu';
import { IonicModule } from 'ionic-angular/module';
import { GoogleLoginComponent } from './google-login/google-login';

@NgModule({
	declarations: 
	[AllComponent,MenuComponent,
    GoogleLoginComponent],
	
	imports: [IonicModule],

	exports: [AllComponent,MenuComponent,
    GoogleLoginComponent]
})
export class ComponentsModule {}
