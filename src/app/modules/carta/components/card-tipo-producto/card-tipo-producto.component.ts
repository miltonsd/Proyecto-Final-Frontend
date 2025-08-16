import { Component, Input } from '@angular/core'
import { TipoProducto } from '@pa/shared/interfaces/tipoProducto/tipoProducto.interface'

@Component({
  selector: 'pa-card-tipo-producto',
  templateUrl: './card-tipo-producto.component.html',
  styleUrls: ['./card-tipo-producto.component.css']
})
export class CardTipoProductoComponent {
  @Input() tipo!: TipoProducto
}
