import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { HomeComponent } from '@pa/home/home.component'
import { HomeRoutingModule } from '@pa/home/home-routing.module'
import { CarruselComponent } from '@pa/home/components/carrusel/carrusel.component'
import { FaqAccordionComponent } from '@pa/modules/home/components/faq-accordion/faq-accordion.component'
import { AboutComponent } from '@pa/home/views/about/about.component'
import { FaqComponent } from '@pa/home/views/faq/faq.component'
import { MaterialModule } from '@pa/shared/modules'

@NgModule({
  declarations: [
    HomeComponent,
    CarruselComponent,
    FaqAccordionComponent,
    AboutComponent,
    FaqComponent
  ],
  imports: [CommonModule, HomeRoutingModule, MaterialModule, FontAwesomeModule]
})
export class HomeModule {}
