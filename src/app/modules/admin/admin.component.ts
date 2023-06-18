import { Component } from '@angular/core'

@Component({
  selector: 'pa-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  tablasDB = [
    { nombre: 'Usuarios', url: 'usuarios' },
    { nombre: 'Pedidos', url: 'pedidos' },
    { nombre: 'Pedidos pendientes', url: 'pedidosPendientes' },
    { nombre: 'Productos', url: 'productos' },
    { nombre: 'Reservas', url: 'reservas' },
    { nombre: 'Categorias', url: 'categorias' },
    { nombre: 'Menues', url: 'menues' },
    { nombre: 'Mesas', url: 'mesas' },
    { nombre: 'Roles', url: 'roles' },
    { nombre: 'Tipos producto', url: 'tipos-producto' },
    { nombre: 'Promociones', url: 'promociones' }
  ]
}
