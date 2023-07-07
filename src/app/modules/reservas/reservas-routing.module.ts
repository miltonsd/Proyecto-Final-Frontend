import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ReservasComponent } from './reservas.component'
import { canActivateAuthGuard } from 'src/app/shared/guards/auth/can-activate-auth.guard'
import { canActivateUsuarioGuard } from 'src/app/shared/guards/usuario/can-activate-usuario.guard'

const routes: Routes = [
  {
    path: '',
    component: ReservasComponent,
    canActivate: [canActivateAuthGuard, canActivateUsuarioGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservasRoutingModule {}
