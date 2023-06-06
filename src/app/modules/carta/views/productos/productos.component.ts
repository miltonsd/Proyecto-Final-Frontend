import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { ProductosService } from '../../services/productos.service'
import { map } from 'rxjs/operators'

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
  carrito!: any[]

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
      name: '  ',
      dataKey: 'cant_actual'
    }
  ]

  constructor(private _productoService: ProductosService) {}

  ngOnInit(): void {
    this.getAllProductos()
  }

  getAllProductos() {
    this._productoService
      .getAllProductos()
      .pipe(
        map((res: any) => {
          const productos = Object.keys(res).map((p) => ({
            id_producto: res[p].id_producto,
            descripcion: res[p].descripcion,
            precio: res[p].precio,
            stock: res[p].stock,
            id_tipoProducto: res[p].TipoProducto.id_tipoProducto,
            imagen: res[p].imagen,
            cant_actual: 0
          }))
          this.ensaladas = productos.filter((p) => p.id_tipoProducto === 1)
          this.paraPicar = productos.filter((p) => p.id_tipoProducto === 2)
          this.sandwiches = productos.filter((p) => p.id_tipoProducto === 3)
          this.principales = productos.filter((p) => p.id_tipoProducto === 4)
          this.postres = productos.filter((p) => p.id_tipoProducto === 5)
          this.bebidasSA = productos.filter((p) => p.id_tipoProducto === 6)
          this.cervezas = productos.filter((p) => p.id_tipoProducto === 7)
          this.vinos = productos.filter((p) => p.id_tipoProducto === 8)
          this.tragos = productos.filter((p) => p.id_tipoProducto === 9)
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

  onSubmit() {
    // Almacenar en el carrito[] todos los productos de cada lista que tengan cant > 0 para pasar al modulo de carrito
    // this.carrito.push(this.ensaladas.filter((p) => p.cant_actual !== 0))
    // this.carrito.push(this.cervezas.filter((p) => p.cant_actual !== 0))
    // this.carrito.push(this.vinos.filter((p) => p.cant_actual !== 0))
    // console.log(this.carrito)
  }
}
