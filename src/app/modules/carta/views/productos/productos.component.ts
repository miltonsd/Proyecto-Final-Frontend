import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnInit
} from '@angular/core'
import { TableColumn } from '@pa/shared/interfaces/tabla/table-column.interface'
import { ProductosService } from '../../services/productos.service'
import { map } from 'rxjs/operators'
import { PedidosService } from '../../services/pedidos.service'
import { ActivatedRoute } from '@angular/router'
import { PedidoPOST } from 'src/app/modules/pedidos/models/pedido'
import { AuthService } from '@pa/shared/services/auth.service'
import { MatDialog } from '@angular/material/dialog'
import { DialogDetalleProductoComponent } from '../../components/dialog-detalle-producto/dialog-detalle-producto.component'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { DialogComponent } from '@pa/shared/components'
import { CurrencyPipe, DOCUMENT } from '@angular/common'
import { DialogConfirmPedidoComponent } from '../../components/dialog-confirm-pedido/dialog-confirm-pedido.component'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'pa-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [CurrencyPipe]
})
export class ProductosComponent implements OnInit, AfterViewInit {
  carrito: any[] = []
  productos: any[] = []
  productosPorTipo: { [tipo: string]: any[] } = {}
  cookieValue!: string
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

  constructor(
    private _productoService: ProductosService,
    private _pedidoService: PedidosService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private _cookieService: CookieService,
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
    // Cargar los productos de la carta al iniciar el componente
    this.cargarProductosCarta()

    // Guardar el fragmento sin intentar desplazarse aún
    this.route.fragment.subscribe((fragment) => {
      this.fragment = fragment
    })

    // Se definen las columnas de la tabla según si el usuario está logueado o no
    this.columnas = this.getColumnas(this.usuarioLogueado)
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

  cargarProductosCarta() {
    this._productoService
      .getProductosCarta()
      .pipe(
        map((res: any) => {
          this.productos = Object.keys(res).map((p) => {
            return {
              id_producto: res[p].id_producto,
              descripcion: res[p].promocion
                ? `${res[p].descripcion} (${
                    res[p].promocion.porcentaje_descuento * 100
                  }% OFF- Antes: ${this.currencyPipe.transform(
                    res[p].precio_original,
                    'ARS'
                  )})`
                : res[p].descripcion,
              precio: res[p].promocion
                ? res[p].promocion.precio_con_descuento
                : res[p].precio_original,
              stock: res[p].stock,
              id_tipoProducto: res[p].id_tipoProducto,
              tipoProducto: res[p].tipoProducto,
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

  getColumnas(usuarioLogueado: boolean) {
    const columnasBase: TableColumn[] = [
      { name: 'Descripción', dataKey: 'descripcion', showDetails: true },
      { name: 'Precio unitario', dataKey: 'precio', isCurrency: true }
    ]
    if (usuarioLogueado) {
      columnasBase.push(
        { name: 'Cantidad seleccionada', dataKey: 'cant_selecc' },
        {
          name: ' ',
          dataKey: 'actionButtons',
          addButton: true,
          removeButton: true
        }
      )
    }
    return columnasBase
  }

  canPlaceOrder(): boolean {
    // Comprueba si tiene una mesa asignada y hay productos seleccionados (cant_selecc > 0), para que el botón "Realizar pedido" se habilite o deshabilite
    return (
      this._cookieService.check('ClienteMesa') &&
      this.productos.some((p) => p.cant_selecc > 0)
    )
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

  onSubmit() {
    // Almacenar en el carrito[] todos los productos de cada lista que tengan cant > 0 para pasar al modulo de carrito
    this.carrito = this.productos.filter((p) => p.cant_selecc > 0)

    // En caso de que el carrito esté vacío, muestra un mensaje de error y no permite realizar el pedido
    if (this.carrito.length === 0) {
      this.dialog.open(DialogComponent, {
        width: '375px',
        autoFocus: true,
        data: { title: 'Carrito vacío', msg: 'No hay productos seleccionados.' }
      })
      return
    }

    // Obtiene el id_usuario y el id_mesa desde la cookie
    this.cookieValue = this._cookieService.get('ClienteMesa')
    const [idUsuario, idMesa] = this.cookieValue.split(':').map(Number)
    const idUsuarioLogueado = this._authService.getCurrentUserId()

    // Si no coinciden ambos id_usuario, muestra un mensaje de error y no permite realizar el pedido
    if (idUsuario !== idUsuarioLogueado) {
      this.dialog.open(DialogComponent, {
        width: '375px',
        autoFocus: true,
        data: {
          title: 'Error de usuario',
          msg: 'El usuario de la mesa no coincide con el usuario logueado. Por favor, inicie sesión nuevamente.'
        }
      })
      return
    }

    // Dialog para confirmar el Pedido, mostrando los productos seleccionados con sus cantidades y la observación ingresada
    const dialogRef = this.dialog.open(DialogConfirmPedidoComponent, {
      width: '600px',
      data: { carrito: this.carrito, idMesa }
    })
    // Al cerrar el dialog, si se confirma la acción, se crea el pedido
    dialogRef.afterClosed().subscribe((respuesta) => {
      if (respuesta.confirmado) {
        // Crea el pedido con los datos necesarios
        const pedido: PedidoPOST = {
          fechaHora: new Date(),
          montoImporte: respuesta.montoImporte,
          id_usuario: idUsuario, // Se asigna el id_usuario de la Cookie
          id_mesa: idMesa, // Se asigna el id_mesa de la Cookie
          lista_productos: this.carrito,
          observacion: respuesta.observacion || 'No hay.'
        }
        console.log(pedido)
        this._pedidoService.createPedido(pedido).subscribe({
          next: (res: any) => {
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
    })
  }
}
