import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UsuariosComponent } from './usuarios.component'
import { PerfilComponent } from './views/perfil/perfil.component'
import { HReservasComponent } from './views/h-reservas/h-reservas.component'
import { MenuesComponent } from './views/menues/menues.component'
import { canActivateAuthGuard } from 'src/app/shared/guards/auth/can-activate-auth.guard'
import { canActivateChildAuthGuard } from 'src/app/shared/guards/auth/can-activate-child-auth.guard'
import { PedidosDiaComponent } from './views/pedidos-dia/pedidos-dia.component'
import { HResumenesComponent } from './views/h-resumenes/h-resumenes.component'

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
          { path: 'resumenes', component: HResumenesComponent },
          { path: 'menues', component: MenuesComponent },
          { path: 'pedidos', component: PedidosDiaComponent }
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
