import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PedidosComponent } from '@pa/pedidos/pedidos.component'
import { canActivateAuthGuard } from '@pa/shared/guards/auth/can-activate-auth.guard'
import { canActivateCocinaOMozoGuard } from '@pa/shared/guards/cocina-o-mozo/can-activate-cocina-o-mozo.guard'

const routes: Routes = [
  {
    path: '',
    component: PedidosComponent,
    canActivate: [canActivateAuthGuard, canActivateCocinaOMozoGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule {}
