import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnInit
} from '@angular/core'
import { IMesa, TableColumn } from '@pa/shared/models'
import { ProductosService } from '../../services/productos.service'
import { map } from 'rxjs/operators'
import { PedidosService } from '../../services/pedidos.service'
import { ActivatedRoute } from '@angular/router'
import { MesasService } from '@pa/mesas/services'
import { PedidoPOST } from 'src/app/modules/pedidos/models/pedido'
import { AuthService } from '@pa/auth/services'
import { PromocionesService } from '@pa/admin/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogDetalleProductoComponent } from '../../components/dialog-detalle-producto/dialog-detalle-producto.component'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { DialogComponent } from '@pa/shared/components'
import { CurrencyPipe, DOCUMENT } from '@angular/common'
import { DialogConfirmPedidoComponent } from '../../components/dialog-confirm-pedido/dialog-confirm-pedido.component'

@Component({
  selector: 'pa-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [CurrencyPipe]
})
export class ProductosComponent implements OnInit, AfterViewInit {
  carrito: any[] = []
  productos!: any[]
  productosPorTipo: { [tipo: string]: any[] } = {}
  promociones: any[] = []
  mesa: IMesa | undefined
  usuarioLogueado = this._authService.loggedIn()
  faCartShopping = faCartShopping

  // Defino las columnas de los productos
  columnas: TableColumn[] = []

  // Defino el fragmento de la URL
  private fragment: string | null = null

  // Defino propiedades para el boton flotante
  posicionFija = true // El botón se muestra fijo desde el inicio
  posicionBoton = '20px' // Espacio inferior cuando el botón es fijo
  distanciaFooterVH = 15 // Distancia en porcentaje de la altura de la ventana
  distanciaFinal!: number // Distancia en píxeles antes de llegar al final de la página

  msgConfirmacion = {
    title: 'Confirmar eliminación del usuario',
    msg: '¿Estás seguro de eliminar el usuario? Esta acción no se puede deshacer.'
  }

  constructor(
    private _productoService: ProductosService,
    private _pedidoService: PedidosService,
    private _promocionService: PromocionesService,
    private route: ActivatedRoute,
    private _mesaService: MesasService,
    private _authService: AuthService,
    public dialog: MatDialog,
    private currencyPipe: CurrencyPipe,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Altura total del documento (página completa)
    const documentHeight = this.document.documentElement.scrollHeight
    // Altura de la ventana (viewport)
    const windowHeight = window.innerHeight
    // Distancia actual scrolleada desde la parte superior
    const scrollY = window.scrollY || document.documentElement.scrollTop

    // Calcula la distancia desde el fondo de la página hasta el final del viewport
    const distanceToBottom = documentHeight - (scrollY + windowHeight)

    // Calcula 15vh en píxeles
    this.distanciaFinal = windowHeight * (this.distanciaFooterVH / 100)

    // Si la distancia al fondo es menor que la distanciaFinal, cambia la posición a absoluta
    if (distanceToBottom <= this.distanciaFinal) {
      this.posicionFija = false
      this.posicionBoton = `5px`
    } else {
      // Si estamos lejos del fondo, mantiene el botón en posición fija
      this.posicionFija = true
      this.posicionBoton = '20px' // Posición normal desde abajo
    }
  }

  ngOnInit(): void {
    this.getPromociones()
    this.getAllProductos()
    // Guardar el fragmento sin intentar desplazarse aún
    this.route.fragment.subscribe((fragment) => {
      this.fragment = fragment
    })
    // Suscribirse al parámetro de la URL para saber si el usuario escaneó una mesa
    this.route.queryParams.subscribe((params) => {
      params['id_mesa'] !== '0' && this.getMesa(params['id_mesa'])
    })
    if (this.usuarioLogueado) {
      this.columnas = [
        { name: 'Descripción', dataKey: 'descripcion', showDetails: true },
        {
          name: 'Precio unitario',
          dataKey: 'precio',
          isCurrency: true
        },
        {
          name: ' ',
          dataKey: 'actionButtons',
          addButton: true,
          removeButton: true
        },
        // Buscar la forma que solo se muestre cuando el usuario este logueado
        {
          name: 'Cantidad seleccionada',
          dataKey: 'cant_selecc'
        }
      ]
    } else {
      // En caso de que el usuario no esté logueado
      this.columnas = [
        { name: 'Descripción', dataKey: 'descripcion', showDetails: true },
        {
          name: 'Precio unitario',
          dataKey: 'precio',
          isCurrency: true
        },
        {
          name: ' ',
          dataKey: 'actionButtons',
          addButton: true,
          removeButton: true
        }
      ]
    }
  }

  ngAfterViewInit(): void {
    // Intentar desplazarse al fragmento solo después de que el DOM esté cargado
    if (this.fragment) {
      setTimeout(() => {
        this.scrollToAnchor(this.fragment!)
      }, 50) // Puedes ajustar el tiempo si es necesario
    }
  }

  // Método para desplazarse al ancla
  scrollToAnchor(fragment: string) {
    const element = document.getElementById(fragment)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
            const { precioF, descripcionF } = this.calcularPrecioYDescripcion(
              res[p]
            )
            return {
              id_producto: res[p].id_producto,
              descripcion: descripcionF,
              precio: precioF,
              stock: res[p].stock,
              id_tipoProducto: res[p].TipoProducto.id_tipoProducto,
              tipoProducto: res[p].TipoProducto.descripcion,
              imagen: this._productoService.getProductoImagen(res[p].imagen),
              // El metodo getProductoImagen devuelve la url completa de la imagen a partir del path que se almacena en la DB
              detalle: res[p].detalle,
              cant_selecc: 0
            }
          })
          this.getProductosTipos()
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  // Método para calcular el precio final y la descripción
  calcularPrecioYDescripcion(producto: any): {
    precioF: number
    descripcionF: string
  } {
    // Valida si el producto tiene una promoción vigente
    const promocion = this.promociones.find(
      (prom) =>
        prom.lista_productos.some(
          // El some equivale al includes pero se usa cuando tenes un array de objetos
          (prod: any) => prod.id_producto === producto.id_producto
        ) &&
        new Date(prom.fecha_desde) <= new Date() &&
        new Date() <= new Date(prom.fecha_hasta)
    )
    if (promocion) {
      return {
        descripcionF: `${producto.descripcion} (${
          promocion.porcentaje_desc * 100
        }% OFF- Antes: ${this.currencyPipe.transform(
          producto.precio,
          'ARS',
          'symbol',
          '1.2-2',
          'es'
        )})`,
        precioF: producto.precio - producto.precio * promocion.porcentaje_desc
      }
    } else {
      return {
        descripcionF: producto.descripcion,
        precioF: producto.precio
      }
    }
  }

  // Este metodo nos permite agrupar (filtrar) los productos de forma dinamica según su tipo.
  getProductosTipos() {
    this.productosPorTipo = this.productos.reduce((acumulador, p) => {
      const tipo = p.tipoProducto
      if (!acumulador[tipo]) {
        acumulador[tipo] = []
      }
      acumulador[tipo].push(p)
      return acumulador
    }, {}) // ({}) es el valor inicial del acumulador. Sin esto, fallaría
  }

  // Método para obtener las claves del objeto productosPorTipo en el HTML
  getTipos() {
    return Object.keys(this.productosPorTipo)
  }

  canPlaceOrder(): boolean {
    // Comprueba si hay productos seleccionados (cant_selecc > 0), para que el botón "Realizar pedido" se habilite o deshabilite
    return this.productos.some((producto) => producto.cant_selecc > 0)
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

  verDetalles(producto: any) {
    this.dialog.open(DialogDetalleProductoComponent, {
      width: '600px',
      data: { producto }
    })
  }

  // Almacenar en el carrito[] todos los productos de cada lista que tengan cant > 0 para pasar al modulo de carrito
  onSubmit(observacion: string) {
    this.carrito = this.productos.filter((p) => p.cant_selecc > 0)
    console.log(this.carrito)
    const carrito = this.carrito
    // Muestra un dialog para confirmar el Pedido, mostrando los productos seleccionados con sus cantidades y la observación ingresada
    const dialogRef = this.dialog.open(DialogConfirmPedidoComponent, {
      width: '600px',
      data: { carrito, observacion }
      // data: this.confirmDialogMsg
      // data: { msg: element.productos }
    })
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.carrito = this.productos.filter((p) => p.cant_selecc > 0)
        if (this.carrito.length > 0 && this.mesa?.habilitada) {
          this.carrito.forEach((p) => {
            p.stock -= p.cant_selecc
            this._productoService.updateProducto(p.id_producto, p.stock)
          })
          // const pedido: PedidoPOST = {
          const pedido: PedidoPOST = {
            fechaHora: new Date(),
            montoImporte: this.calculaMonto(),
            id_usuario: this._authService.getCurrentUserId(), // Se asigna el id_usuario correspondiente para el usuario logueado
            id_mesa: this.mesa?.id_mesa,
            lista_productos: this.carrito,
            observacion: observacion
          }
          this._pedidoService.createPedido(pedido).subscribe({
            next: (res: any) => {
              // if (localStorage.getItem('carrito') !== null) {
              //   const pedidoViejo = localStorage.getItem('carrito') as string
              //   const nuevoPedido = this.carrito
              //   this.carrito = JSON.parse(pedidoViejo)
              //   this.carrito.push(...nuevoPedido)
              //   console.log('Nueva lista: ', this.carrito)
              // }
              // localStorage.setItem('carrito', JSON.stringify(this.carrito)) //Para ver el localStorage ir al inspeccionar del buscador - Aplicación - Almacenamiento local

              console.log(res)
              //Mostar detalles del pedido (productos seleccionados con sus cants)
              const dialogRef = this.dialog.open(DialogComponent, {
                width: '375px',
                autoFocus: true,
                data: { title: 'Realizar pedido', msg: res.msg }
              })
              dialogRef.afterClosed().subscribe(() => {
                window.location.href = '/'
              })
            },
            error: (err: any) => {
              console.error(`Código de error ${err.status}: `, err.error.msg)
            }
          })
        }
        // this.deleteAction.emit(element)
      }
    })

    // const dialogRef = this.dialog.open(DialogComponent, {
    //   width: '300 px',
    //   data: {
    //     title: 'Eliminar usuario',
    //     msg: res.msg
    //   }
    // })
    // dialogRef.afterClosed().subscribe(() => {
    //   window.location.href = '/admin/usuarios'
    // })
  }

  calculaMonto(): number {
    let monto = 0
    this.carrito.forEach((p) => {
      monto += p.precio * p.cant_selecc
    })
    return monto
  }
}
