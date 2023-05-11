import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasRoutingModule } from './reservas-routing.module';
import { ReservasComponent } from './reservas.component';
import { MaterialModule } from '@pa/shared/modules';
import { ReservasService } from '@pa/reservas/services';
@NgModule({
  declarations: [
    ReservasComponent
  ],
  imports: [
    CommonModule,
    ReservasRoutingModule,
    MaterialModule,
  ],
  providers: [ReservasService]
})
export class ReservasModule { }
