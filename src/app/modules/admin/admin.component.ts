import { Component } from '@angular/core'

@Component({
  selector: 'pa-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  tablasDB = [
    {
      nombre: 'Categorías',
      url: 'categorias',
      imagen: '../../../assets/img/admin/categoria.jpg'
    },
    {
      nombre: 'Menús',
      url: 'menus',
      imagen: '../../../assets/img/admin/menu.jpg'
    },
    {
      nombre: 'Mesas',
      url: 'mesas',
      imagen: '../../../assets/img/admin/mesa.jpg'
    },
    {
      nombre: 'Pedidos',
      url: 'pedidos',
      imagen: '../../../assets/img/admin/pedido.jpg'
    },
    {
      nombre: 'Productos',
      url: 'productos',
      imagen: '../../../assets/img/admin/producto.jpg'
    },
    {
      nombre: 'Promociones',
      url: 'promociones',
      imagen: '../../../assets/img/admin/promocion.jpg'
    },
    {
      nombre: 'Reservas',
      url: 'reservas',
      imagen: '../../../assets/img/admin/reserva.jpg'
    },
    {
      nombre: 'Resúmenes',
      url: 'resumenes',
      imagen: '../../../assets/img/admin/resumen.jpg'
    },
    {
      nombre: 'Roles',
      url: 'roles',
      imagen: '../../../assets/img/admin/rol.jpg'
    },
    {
      nombre: 'Tipos producto',
      url: 'tipos-producto',
      imagen: '../../../assets/img/admin/tipoProducto.jpg'
    },
    {
      nombre: 'Usuarios',
      url: 'usuarios',
      imagen: '../../../assets/img/admin/usuario.jpg'
    }
  ]
}
