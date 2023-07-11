import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MesasComponent } from './mesas.component'
import { canActivateAuthGuard } from 'src/app/shared/guards/auth/can-activate-auth.guard'
import { canActivateMozoGuard } from 'src/app/shared/guards/mozo/can-activate-mozo.guard'

const routes: Routes = [
  {
    path: '',
    component: MesasComponent,
    canActivate: [canActivateAuthGuard, canActivateMozoGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesasRoutingModule {}
