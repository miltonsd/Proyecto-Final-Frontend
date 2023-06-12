import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models'
import { UsuariosService } from '@pa/usuarios/services'
import { map } from 'rxjs'
import { CartaService, PedidosService } from '@pa/carta/services'
import { PromocionesService } from '../../services/promociones.service'
import { RolesService } from '../../services/roles.service'
import { MesasService } from '@pa/mesas/services'

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
    private _usuarioService: UsuariosService,
    private _mesaService: MesasService,
    private _rolService: RolesService,
    private _cartaService: CartaService,
    private _promocionService: PromocionesService,
    private _pedidoService: PedidosService
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

  cargarMesas() {
    // Obtengo los datos de la tabla mesas
    this._mesaService
      .getAllMesas()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((m) => ({
            id_mesa: res[m].id_mesa,
            capacidad: res[m].capacidad,
            ubicacion: res[m].ubicacion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla mesas
    this.columnas = [
      { name: 'ID', dataKey: ' id_mesa' },
      { name: 'Capacidad', dataKey: 'capacidad' },
      { name: 'Ubicacion', dataKey: 'ubicacion' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  cargarRoles() {
    // Obtengo los datos de la tabla roles
    this._rolService
      .getAllRoles()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((r) => ({
            id_rol: res[r].id_rol,
            descripcion: res[r].descripcion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla roles
    this.columnas = [
      { name: 'ID', dataKey: ' id_rol' },
      { name: 'Descripcion', dataKey: 'descripcion' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  cargarTiposProducto() {
    // Obtengo los datos de la tabla tipos_productos
    this._cartaService
      .getAllTiposProducto()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((tp) => ({
            id_tipoProducto: res[tp].id_tipoProducto,
            descripcion: res[tp].descripcion,
            imagen: res[tp].imagen
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla tipos_productos
    this.columnas = [
      { name: 'ID', dataKey: ' id_tipoProducto' },
      { name: 'Descripcion', dataKey: 'descripcion' },
      { name: 'Imagen', dataKey: 'imagen' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  cargarPromociones() {
    // Obtengo los datos de la tabla Promociones
    this._promocionService
      .getAllPromociones()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((p) => ({
            id_promocion: res[p].id_promocion,
            porcentaje_desc: res[p].porcentaje_desc,
            fecha_desde: moment(res[p].fecha_desde).format('DD/MM/yyyy'),
            fecha_hasta: moment(res[p].fecha_hasta).format('DD/MM/yyyy')
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Promociones
    this.columnas = [
      { name: 'ID', dataKey: 'id_promocion' },
      { name: 'Porcentaje de descuento', dataKey: 'porcentaje_desc' },
      { name: 'Fecha desde', dataKey: 'fecha_desde' },
      { name: 'Fecha hasta', dataKey: 'fecha_hasta' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  cargarPedidos() {
    // Obtengo los datos de la tabla Pedidos
    this._pedidoService
      .getAllPedidos()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((p) => ({
            id_pedido: res[p].id_pedido,
            fechaHora: moment(res[p].fechaHora).format('DD/MM/yyyy HH:mm'),
            isPendiente: res[p].isPendiente,
            montoImporte: res[p].montoImporte,
            usuario: res[p].Usuario.nombre + ' ' + res[p].Usuario.apellido
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Pedidos
    this.columnas = [
      { name: 'ID', dataKey: 'id_pedido' },
      { name: 'Fecha y hora', dataKey: 'fechaHora' },
      { name: '¿Está pendiente?', dataKey: 'isPendiente' },
      { name: 'Monto importe', dataKey: 'montoImporte', isCurrency: true },
      { name: 'Usuario', dataKey: 'usuario' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }
}
