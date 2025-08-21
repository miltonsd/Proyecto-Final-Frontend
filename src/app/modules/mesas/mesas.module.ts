import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MesasRoutingModule } from './mesas-routing.module'
import { MesasComponent } from './mesas.component'

import { ComponentsModule, MaterialModule } from '@pa/shared/modules'

@NgModule({
  declarations: [MesasComponent],
  imports: [CommonModule, MesasRoutingModule, ComponentsModule, MaterialModule]
})
export class MesasModule {}
