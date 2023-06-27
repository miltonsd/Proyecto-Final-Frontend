import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { ReservasRoutingModule } from './reservas-routing.module'
import { ReservasComponent } from './reservas.component'

// Shared
import { ComponentsModule, MaterialModule } from '@pa/shared/modules'
import { DialogEditarReservaComponent } from './components/dialog-editar-reserva/dialog-editar-reserva.component'

const modules = [ComponentsModule, MaterialModule]

@NgModule({
  declarations: [ReservasComponent, DialogEditarReservaComponent],
  imports: [
    CommonModule,
    ReservasRoutingModule,
    ReactiveFormsModule,
    ...modules
  ],
})
export class ReservasModule {}
