import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { ReservasRoutingModule } from '@pa/reservas/reservas-routing.module'
import { ReservasComponent } from '@pa/reservas/reservas.component'

// Shared
import { ComponentsModule, MaterialModule } from '@pa/shared/modules'
import { DialogEditarReservaComponent } from '@pa/reservas/components/dialog-editar-reserva/dialog-editar-reserva.component'
import { MesaGridComponent } from '@pa/reservas/components/mesa-grid/mesa-grid.component'

const components = [
  ReservasComponent,
  DialogEditarReservaComponent,
  MesaGridComponent
]
const modules = [ComponentsModule, MaterialModule]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReservasRoutingModule,
    ReactiveFormsModule,
    ...modules
  ]
})
export class ReservasModule {}
