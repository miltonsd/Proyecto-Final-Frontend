import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { ProductosService } from '../../services/productos.service'
import { map } from 'rxjs/operators'
import { PedidosService } from '../../services/pedidos.service'

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

  // Defino las columnas de los productos
  columnas: TableColumn[] = [
    { name: 'Descripción', dataKey: 'descripcion' },
    {
      name: 'Precio unitario (AR$)',
      dataKey: 'precio'
    },
    {
      name: ' ',
      dataKey: 'actionButtons',
      addButton: true,
      removeButton: true
    },
    {
      name: 'Cantidad seleccionada',
      dataKey: 'cant_actual'
    }
  ]

  constructor(
    private _productoService: ProductosService,
    private _pedidoService: PedidosService
  ) {}

  ngOnInit(): void {
    this.getAllProductos()
  }

  getAllProductos() {
    this._productoService
      .getAllProductos()
      .pipe(
        map((res: any) => {
          this.productos = Object.keys(res).map((p) => ({
            id_producto: res[p].id_producto,
            descripcion: res[p].descripcion,
            precio: res[p].precio,
            stock: res[p].stock,
            id_tipoProducto: res[p].TipoProducto.id_tipoProducto,
            imagen: res[p].imagen,
            cant_actual: 0
          }))
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
    if (producto.cant_actual < 10 && producto.cant_actual < producto.stock) {
      producto.cant_actual += 1
    }
  }

  removeToCart(producto: any) {
    if (producto.cant_actual > 0) {
      producto.cant_actual -= 1
    }
  }

  // Almacenar en el carrito[] todos los productos de cada lista que tengan cant > 0 para pasar al modulo de carrito
  onSubmit() {
    this.carrito = this.productos.filter((p) => p.cant_actual > 0)
    if (this.carrito.length > 0) {
      this.carrito.forEach((p) => {
        p.stock -= p.cant_actual
        // p.cant_actual = 0
        this._productoService.updateProducto(p.id_producto, p.stock)
      })
      const pedido = {
        fechaHoraPedido: new Date(),
        montoImporte: 10000, // Pendiente de hacer el cálculo
        id_usuario: 1,
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
}
