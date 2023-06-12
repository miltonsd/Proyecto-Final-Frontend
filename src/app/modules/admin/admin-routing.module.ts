import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminComponent } from './admin.component'
import { ListadoComponent } from './views/listado/listado.component'

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'listar', component: ListadoComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
