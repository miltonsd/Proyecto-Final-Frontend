import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from './admin.component'
import { CardAdminComponent } from './components/card-admin/card-admin.component'

// Shared
import { ComponentsModule, MaterialModule } from '@pa/shared/modules';
import { ListadoComponent } from './views/listado/listado.component'

const modules = [ComponentsModule, MaterialModule]

@NgModule({
  declarations: [AdminComponent, CardAdminComponent, ListadoComponent],
  imports: [CommonModule, AdminRoutingModule, ...modules]
})
export class AdminModule {}
