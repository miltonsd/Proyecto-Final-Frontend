import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CartaComponent } from './carta.component'
import { ProductosComponent } from './views/productos/productos.component'

const routes: Routes = [
  { path: '', component: CartaComponent },
  { path: 'productos', component: ProductosComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartaRoutingModule {}
