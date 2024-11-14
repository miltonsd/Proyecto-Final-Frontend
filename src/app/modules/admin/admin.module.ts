import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from './admin.component'
import { CardAdminComponent } from './components/card-admin/card-admin.component'
import { BotonVolverComponent } from './components/boton-volver/boton-volver.component'

// Shared
import { ComponentsModule, MaterialModule } from '@pa/shared/modules'

// Views
import { UsuariosComponent } from './views/usuarios/usuarios.component'
import { ProductosComponent } from './views/productos/productos.component'
import { PedidosComponent } from './views/pedidos/pedidos.component'
import { ReservasComponent } from './views/reservas/reservas.component'
import { CategoriasComponent } from './views/categorias/categorias.component'
import { MenuesComponent } from './views/menues/menues.component'
import { MesasComponent } from './views/mesas/mesas.component'
import { RolesComponent } from './views/roles/roles.component'
import { PromocionesComponent } from './views/promociones/promociones.component'
import { TiposProductoComponent } from './views/tipos-producto/tipos-producto.component'

// Dialogs components
import { CategoriasDialogComponent } from './components/categorias-dialog/categorias-dialog.component'
import { MenuesDialogComponent } from './components/menues-dialog/menues-dialog.component'
import { MesasDialogComponent } from './components/mesas-dialog/mesas-dialog.component'
import { PedidosDialogComponent } from './components/pedidos-dialog/pedidos-dialog.component'
import { ProductosDialogComponent } from './components/productos-dialog/productos-dialog.component'
import { PromocionesDialogComponent } from './components/promociones-dialog/promociones-dialog.component'
import { ReservasDialogComponent } from './components/reservas-dialog/reservas-dialog.component'
import { RolesDialogComponent } from './components/roles-dialog/roles-dialog.component'
import { TiposProductoDialogComponent } from './components/tipos-producto-dialog/tipos-producto-dialog.component'
import { UsuariosDialogComponent } from './components/usuarios-dialog/usuarios-dialog.component'
import { ResumenesComponent } from './views/resumenes/resumenes.component'

import { ReactiveFormsModule } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

const modules = [ComponentsModule, MaterialModule, FontAwesomeModule]
const views = [
  UsuariosComponent,
  ProductosComponent,
  PedidosComponent,
  ReservasComponent,
  CategoriasComponent,
  MenuesComponent,
  MesasComponent,
  RolesComponent,
  PromocionesComponent,
  TiposProductoComponent,
  ResumenesComponent
]

const dialogs = [
  CategoriasDialogComponent,
  MenuesDialogComponent,
  MesasDialogComponent,
  PedidosDialogComponent,
  ProductosDialogComponent,
  PromocionesDialogComponent,
  ReservasDialogComponent,
  RolesDialogComponent,
  TiposProductoDialogComponent,
  UsuariosDialogComponent
]

@NgModule({
  declarations: [
    AdminComponent,
    CardAdminComponent,
    BotonVolverComponent,
    ...views, // De esta manera se declara al array de vistas del modulo admin
    ...dialogs
  ],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule, ...modules]
})
export class AdminModule {}
