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
    { nombre: 'Productos', url: 'productos' },
    { nombre: 'Reservas', url: 'reservas' },
    { nombre: 'Categorías', url: 'categorias' },
    { nombre: 'Menús', url: 'menus' },
    { nombre: 'Mesas', url: 'mesas' },
    { nombre: 'Roles', url: 'roles' },
    { nombre: 'Tipos producto', url: 'tipos-producto' },
    { nombre: 'Promociones', url: 'promociones' },
    { nombre: 'Resúmenes', url: 'resumenes' }
  ]
}
