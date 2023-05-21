import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
// Views
import { AboutComponent, FaqComponent } from '@pa/home/views';


@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    FaqComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
