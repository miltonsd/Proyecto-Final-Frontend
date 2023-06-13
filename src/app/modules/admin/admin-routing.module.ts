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

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'menues', component: MenuesComponent },
  { path: 'mesas', component: MesasComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'promociones', component: PromocionesComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'tipos-producto', component: TiposProductoComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'categorias', component: CategoriasComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
