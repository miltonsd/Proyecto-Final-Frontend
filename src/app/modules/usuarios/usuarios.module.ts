import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { UsuariosRoutingModule } from './usuarios-routing.module'
import { UsuariosComponent } from './usuarios.component'

import { ComponentsModule, MaterialModule } from '@pa/shared/modules'
import { PerfilComponent } from './views/perfil/perfil.component'
import { HReservasComponent } from './views/h-reservas/h-reservas.component'
import { HPedidosComponent } from './views/h-pedidos/h-pedidos.component'
import { MenuesComponent } from './views/menues/menues.component'
import { ConsumicionesDiaComponent } from './views/consumiciones-dia/consumiciones-dia.component'
import { DialogEditarPerfilComponent } from './components/dialog-editar-perfil/dialog-editar-perfil.component';
import { DialogCambiarPasswordComponent } from './components/dialog-cambiar-password/dialog-cambiar-password.component';
import { MenuesdialogComponent } from './components/menuesdialog/menuesdialog.component'

const modules = [ComponentsModule, MaterialModule]

@NgModule({
  declarations: [
    UsuariosComponent,
    PerfilComponent,
    HReservasComponent,
    HPedidosComponent,
    MenuesComponent,
    ConsumicionesDiaComponent,
    DialogEditarPerfilComponent,
    DialogCambiarPasswordComponent,
    MenuesdialogComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    ...modules
  ]
})
export class UsuariosModule {}
