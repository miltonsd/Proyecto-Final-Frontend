import { Component } from '@angular/core'

@Component({
  selector: 'pa-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  tablasDB = [
    'Usuarios',
    'Pedidos',
    'Productos',
    'Reservas',
    'Categorias',
    'Menues',
    'Mesas',
    'Roles',
    'Tipos_producto',
    'Promociones'
  ]
}
