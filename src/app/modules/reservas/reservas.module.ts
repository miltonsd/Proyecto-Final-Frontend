import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { ReservasRoutingModule } from './reservas-routing.module'
import { ReservasComponent } from './reservas.component'

// Services
import { ReservasService } from '@pa/reservas/services'
import { MesasService } from '@pa/mesas/services'

// Shared
import { ComponentsModule, MaterialModule } from '@pa/shared/modules';
import { DialogEditarReservaComponent } from './components/dialog-editar-reserva/dialog-editar-reserva.component'

const modules = [ComponentsModule, MaterialModule]
const services = [ReservasService, MesasService]

@NgModule({
  declarations: [ReservasComponent, DialogEditarReservaComponent],
  imports: [
    CommonModule,
    ReservasRoutingModule,
    ReactiveFormsModule,
    ...modules
  ],
  providers: [...services]
})
export class ReservasModule {}
