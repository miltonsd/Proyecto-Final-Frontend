import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UsuariosComponent } from './usuarios.component'
import { PerfilComponent } from './views/perfil/perfil.component'
import { HReservasComponent } from './views/h-reservas/h-reservas.component'
import { HPedidosComponent } from './views/h-pedidos/h-pedidos.component'
import { MenuesComponent } from './views/menues/menues.component'
import { ConsumicionesDiaComponent } from './views/consumiciones-dia/consumiciones-dia.component'
import { canActivateAuthGuard } from 'src/app/shared/guards/auth/can-activate-auth.guard'
import { canActivateChildAuthGuard } from 'src/app/shared/guards/auth/can-activate-child-auth.guard'

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    canActivate: [canActivateAuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [canActivateChildAuthGuard],
        children: [
          { path: 'info', component: PerfilComponent },
          { path: 'reservas', component: HReservasComponent },
          { path: 'pedidos', component: HPedidosComponent },
          { path: 'menues', component: MenuesComponent },
          { path: 'consumiciones', component: ConsumicionesDiaComponent }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
