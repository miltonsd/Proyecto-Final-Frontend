import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UsuariosRoutingModule } from './usuarios-routing.module'
import { UsuariosComponent } from './usuarios.component'

import { ComponentsModule, MaterialModule } from '@pa/shared/modules'

const modules = [ComponentsModule, MaterialModule]

@NgModule({
  declarations: [UsuariosComponent],
  imports: [CommonModule, UsuariosRoutingModule, ...modules]
})
export class UsuariosModule {}
