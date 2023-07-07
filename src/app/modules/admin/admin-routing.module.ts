import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminComponent } from './admin.component'
import { PedidosComponent } from './views/pedidos/pedidos.component'
import { ReservasComponent } from './views/reservas/reservas.component'
import { CategoriasComponent } from './views/categorias/categorias.component'
import { MenuesComponent } from './views/menues/menues.component'
import { MesasComponent } from './views/mesas/mesas.component'
import { ProductosComponent } from './views/productos/productos.component'
import { PromocionesComponent } from './views/promociones/promociones.component'
import { RolesComponent } from './views/roles/roles.component'
import { TiposProductoComponent } from './views/tipos-producto/tipos-producto.component'
import { UsuariosComponent } from './views/usuarios/usuarios.component'
import { canActivateAuthGuard } from 'src/app/shared/guards/auth/can-activate-auth.guard'
import { canActivateAdminGuard } from 'src/app/shared/guards/admin/can-activate-admin.guard'

const routes: Routes = [
  { path: '', component: AdminComponent, canActivate: [canActivateAuthGuard, canActivateAdminGuard] },
  {
    path: 'menues',
    component: MenuesComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'mesas',
    component: MesasComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'pedidos',
    component: PedidosComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'promociones',
    component: PromocionesComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'reservas',
    component: ReservasComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'tipos-producto',
    component: TiposProductoComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  },
  {
    path: 'categorias',
    component: CategoriasComponent,
    canActivate: [canActivateAuthGuard, canActivateAdminGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
