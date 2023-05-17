import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ReservasRoutingModule } from './reservas-routing.module';
import { ReservasComponent } from './reservas.component';

import { MaterialModule } from '@pa/shared/modules';

import { ReservasService } from '@pa/reservas/services';
import { MesasService } from '@pa/mesas/services';
@NgModule({
  declarations: [
    ReservasComponent
  ],
  imports: [
    CommonModule,
    ReservasRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [ReservasService, MesasService]
})
export class ReservasModule { }
