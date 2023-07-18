import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'
// Views
import { AboutComponent, FaqComponent } from '@pa/home/views'
import { CarruselComponent } from './carrusel/carrusel.component'
import { MaterialModule } from '@pa/shared/modules'

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    FaqComponent,
    CarruselComponent
  ],
  imports: [CommonModule, HomeRoutingModule, MaterialModule, FontAwesomeModule]
})
export class HomeModule {}
