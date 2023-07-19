import { Component, OnInit } from '@angular/core'
import { IMesa, TableColumn } from '@pa/shared/models'
import { ProductosService } from '../../services/productos.service'
import { map } from 'rxjs/operators'
import { PedidosService } from '../../services/pedidos.service'
import { ActivatedRoute } from '@angular/router'
import { MesasService } from '@pa/mesas/services'
import { PedidoPOST } from 'src/app/modules/pedidos/models/pedido'
import { AuthService } from '@pa/auth/services'
import { PromocionesService } from '@pa/admin/services'

@Component({
  selector: 'pa-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  ensaladas!: any[]
  paraPicar!: any[]
  sandwiches!: any[]
  principales!: any[]
  postres!: any[]
  bebidasSA!: any[]
  cervezas!: any[]
  vinos!: any[]
  tragos!: any[]
  carrito: any[] = []
  productos!: any[]
  promociones: any[] = []
  mesa: IMesa | undefined
  usuarioLogueado = this._authService.loggedIn()

  // Defino las columnas de los productos
  columnas: TableColumn[] = [
    { name: 'Descripción', dataKey: 'descripcion' },
    {
      name: 'Precio unitario',
      dataKey: 'precioTabla'
      // isCurrency: true
    },
    {
      name: ' ',
      dataKey: 'actionButtons',
      addButton: true,
      removeButton: true
    },
    {
      name: 'Cantidad seleccionada',
      dataKey: 'cant_selecc'
    }
  ]

  constructor(
    private _productoService: ProductosService,
    private _pedidoService: PedidosService,
    private _promocionService: PromocionesService,
    private route: ActivatedRoute,
    private _mesaService: MesasService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getPromociones()
    this.getAllProductos()
    this.route.queryParams.subscribe((params) => {
      params['id_mesa'] !== '0' && this.getMesa(params['id_mesa'])
    })
  }

  getPromociones() {
    this._promocionService
      .getAllPromociones()
      .pipe(
        map((res: any) => {
          this.promociones = Object.keys(res).map((p) => ({
            id_promocion: res[p].id_promocion,
            porcentaje_desc: res[p].porcentaje_desc,
            fecha_desde: res[p].fecha_desde,
            fecha_hasta: res[p].fecha_hasta,
            lista_productos: res[p].Productos.map((prod: any) => {
              return { id_producto: prod.id_producto }
            })
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  getMesa(id: string) {
    this._mesaService.getOneMesa(Number(id)).subscribe({
      next: (res: any) => {
        this.mesa = res
        console.log(res) // Este console.log muestra la mesa traída desde el back (Ver en consola del navegodor)
      },
      error: (err: any) => {
        console.error(`Código de error ${err.status}: `, err.error.msg)
      }
    })
  }

  getAllProductos() {
    this._productoService
      .getAllProductos()
      .pipe(
        map((res: any) => {
          this.productos = Object.keys(res).map((p) => {
            // Valida si el producto tiene una promoción vigente
            const promocion = this.promociones.find(
              (prom) =>
                prom.lista_productos.some(
                  // El some equivale al includes pero se usa cuando tenes un array de objetos
                  (prod: any) => prod.id_producto === res[p].id_producto
                ) &&
                new Date(prom.fecha_desde) <= new Date() &&
                new Date() <= new Date(prom.fecha_hasta)
            )
            if (promocion) {
              return {
                id_producto: res[p].id_producto,
                descripcion:
                  res[p].descripcion +
                  ' (' +
                  (promocion.porcentaje_desc * 100).toString() +
                  '% OFF)',
                precio:
                  res[p].precio - res[p].precio * promocion.porcentaje_desc,
                precioTabla:
                  '(Antes: $ ' +
                  res[p].precio.toString() +
                  ')' +
                  ' → $ ' +
                  (
                    res[p].precio -
                    res[p].precio * promocion.porcentaje_desc
                  ).toString(),
                stock: res[p].stock,
                id_tipoProducto: res[p].TipoProducto.id_tipoProducto,
                imagen: res[p].imagen,
                cant_selecc: 0
              }
            } else {
              return {
                id_producto: res[p].id_producto,
                descripcion: res[p].descripcion,
                precio: res[p].precio,
                precioTabla: '$ ' + res[p].precio,
                stock: res[p].stock,
                id_tipoProducto: res[p].TipoProducto.id_tipoProducto,
                imagen: res[p].imagen,
                cant_selecc: 0
              }
            }
          })
          this.ensaladas = this.productos.filter((p) => p.id_tipoProducto === 1)
          this.paraPicar = this.productos.filter((p) => p.id_tipoProducto === 2)
          this.sandwiches = this.productos.filter(
            (p) => p.id_tipoProducto === 3
          )
          this.principales = this.productos.filter(
            (p) => p.id_tipoProducto === 4
          )
          this.postres = this.productos.filter((p) => p.id_tipoProducto === 5)
          this.bebidasSA = this.productos.filter((p) => p.id_tipoProducto === 6)
          this.cervezas = this.productos.filter((p) => p.id_tipoProducto === 7)
          this.vinos = this.productos.filter((p) => p.id_tipoProducto === 8)
          this.tragos = this.productos.filter((p) => p.id_tipoProducto === 9)
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  addToCart(producto: any) {
    // Como regla de negocio, solo dejamos seleccionar hasta 10 items de un mismo producto y valida que no supere el stock actual
    if (producto.cant_selecc < 10 && producto.cant_selecc < producto.stock) {
      producto.cant_selecc += 1
    }
  }

  removeToCart(producto: any) {
    if (producto.cant_selecc > 0) {
      producto.cant_selecc -= 1
    }
  }

  // Almacenar en el carrito[] todos los productos de cada lista que tengan cant > 0 para pasar al modulo de carrito
  onSubmit() {
    this.carrito = this.productos.filter((p) => p.cant_selecc > 0)
    if (this.carrito.length > 0 && this.mesa?.habilitada) {
      this.carrito.forEach((p) => {
        p.stock -= p.cant_selecc
        this._productoService.updateProducto(p.id_producto, p.stock)
      })
      const pedido: PedidoPOST = {
        fechaHora: new Date(),
        montoImporte: this.calculaMonto(),
        id_usuario: this._authService.getCurrentUserId(), // Se asigna el id_usuario correspondiente para el usuario logueado
        id_mesa: this.mesa?.id_mesa,
        lista_productos: this.carrito
      }
      this._pedidoService.createPedido(pedido).subscribe({
        complete: () => {
          // if (localStorage.getItem('carrito') !== null) {
          //   const pedidoViejo = localStorage.getItem('carrito') as string
          //   const nuevoPedido = this.carrito
          //   this.carrito = JSON.parse(pedidoViejo)
          //   this.carrito.push(...nuevoPedido)
          //   console.log('Nueva lista: ', this.carrito)
          // }
          // localStorage.setItem('carrito', JSON.stringify(this.carrito)) //Para ver el localStorage ir al inspeccionar del buscador - Aplicación - Almacenamiento local
          alert('Pedido realizado') //Mostar detalles del pedido (productos seleccionados con sus cants y al cerrar esa vista que se cargue el home)
          window.location.href = '/'
        },
        error: (err: any) => {
          console.error(`Código de error ${err.status}: `, err.error.msg)
        }
      })
    } else {
      alert('No hay productos seleccionados en el pedido')
    }
  }

  calculaMonto(): number {
    let monto = 0
    this.carrito.forEach((p) => {
      monto += p.precio * p.cant_selecc
    })
    return monto
  }
}
