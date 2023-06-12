import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models'
import { UsuariosService } from '@pa/usuarios/services'
import { map } from 'rxjs'

@Component({
  selector: 'pa-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  tablaDB!: any
  datosTabla: any = []
  columnas: TableColumn[] = []

  constructor(
    private route: ActivatedRoute,
    private _usuarioService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.tablaDB = this.route.snapshot.queryParams['tabla'] // Toma desde el param de la URL el nombre de la tabla de la DB
    switch (this.tablaDB) {
      case 'Usuarios':
        this.cargarUsuarios()
        break
      case 'Productos':
        this.cargarProductos()
        break
      case 'Reservas':
        this.cargarReservas()
        break
      case 'Categorias':
        this.cargarCategorias()
        break
      case 'Menues':
        this.cargarMenues()
        break
      case 'Mesas':
        this.cargarMesas()
        break
      case 'Roles':
        this.cargarRoles()
        break
      case 'Tipos_producto':
        this.cargarTiposProducto()
        break
      case 'Promociones':
        this.cargarPromociones()
        break
      case 'Pedidos':
        this.cargarPedidos()
        break
      default:
        console.error(`No existe la tabla ${this.tablaDB}.`)
    }
  }

  cargarUsuarios() {
    // Obtengo los datos de la tabla Usuarios
    this._usuarioService
      .getAllUsuarios()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((u) => ({
            id_usuario: res[u].id_usuario,
            nombre: res[u].nombre,
            apellido: res[u].apellido,
            email: res[u].email,
            isConfirmado: res[u].isConfirmado,
            documento: res[u].documento,
            direccion: res[u].direccion,
            telefono: res[u].telefono,
            fechaNacimiento: moment(res[u].fechaNacimiento).format(
              'DD/MM/yyyy'
            ),
            rol: res[u].Rol.descripcion,
            categoria: res[u].Categoria.descripcion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Usuarios
    this.columnas = [
      { name: 'ID', dataKey: 'id_usuario' },
      {
        name: 'Nombre',
        dataKey: 'nombre'
      },
      { name: 'Apellido', dataKey: 'apellido' },
      { name: 'Email', dataKey: 'email' },
      { name: '¿Está confirmado?', dataKey: 'isConfirmado' },
      { name: 'Documento', dataKey: 'documento' },
      { name: 'Dirección', dataKey: 'direccion' },
      { name: 'Teléfono', dataKey: 'telefono' },
      { name: 'Fecha de Nacimiento', dataKey: 'fechaNacimiento' },
      { name: 'Rol', dataKey: 'rol' },
      { name: 'Categoría', dataKey: 'categoria' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  cargarProductos() {}
  cargarReservas() {}
  cargarCategorias() {}
  cargarMenues() {}
  cargarMesas() {}
  cargarRoles() {}
  cargarTiposProducto() {}
  cargarPromociones() {}
  cargarPedidos() {}
}
