import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CartaRoutingModule } from './carta-routing.module'
import { CartaComponent } from './carta.component'
import { CardTipoProductoComponent } from './components/card-tipo-producto/card-tipo-producto.component'

// Shared
import { ComponentsModule, MaterialModule } from '@pa/shared/modules'

import { ProductosComponent } from './views/productos/productos.component'

const modules = [ComponentsModule, MaterialModule]
@NgModule({
  declarations: [CartaComponent, CardTipoProductoComponent, ProductosComponent],
  imports: [CommonModule, CartaRoutingModule, ...modules]
})
export class CartaModule {}
