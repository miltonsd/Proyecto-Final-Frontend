import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { ProductosService } from '@pa/carta/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { ProductosDialogComponent } from '../../components/productos-dialog/productos-dialog.component'
import { AdminDataDialog } from '../../models/adminDataDialog'
import { ProductoPOST, ProductoTabla } from './models/producto'

@Component({
  selector: 'pa-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  datosTabla: any = []
  columnasPC: TableColumn[] = []
  columnasCelu: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación del producto',
    msg: '¿Estás seguro de eliminar el producto? Esta acción no se puede deshacer.'
  }

  constructor(
    private _productoService: ProductosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarProductos()
  }

  cargarProductos() {
    // Obtengo los datos de la tabla Productos
    this._productoService
      .getAllProductos()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((p) => ({
            id_producto: res[p].id_producto,
            precio: res[p].precio,
            stock: res[p].stock,
            descripcion: res[p].descripcion,
            detalle: res[p].detalle,
            imagen: this._productoService.getProductoImagen(res[p].imagen),
            // El metodo getProductoImagen devuelve la url completa de la imagen a partir del path que se almacena en la DB
            tipoProducto: res[p].TipoProducto.descripcion,
            id_tipoProducto: res[p].TipoProducto.id_tipoProducto
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Productos
    this.columnasPC = [
      { name: 'Descripción', dataKey: 'descripcion' },
      {
        name: 'Precio unitario',
        dataKey: 'precio',
        isCurrency: true
      },
      { name: 'Stock', dataKey: 'stock' },
      { name: 'Imagen', dataKey: 'imagen', isImage: true },
      { name: 'Tipo de producto', dataKey: 'tipoProducto' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
    this.columnasCelu = [
      { name: 'Descripción', dataKey: 'descripcion' },
      {
        name: 'Precio unitario',
        dataKey: 'precio',
        isCurrency: true
      },
      { name: 'Tipo de producto', dataKey: 'tipoProducto' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(producto: any) {
    this._productoService.deleteProducto(producto.id_producto).subscribe({
      next: (res: any) => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: { title: 'Eliminar producto', msg: res.msg }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/admin/productos'
        })
      },
      error: (err) => {
        this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Error',
            msg: err.error.msg
          }
        })
      }
    })
  }

  onEdit(producto: any) {
    const dataDialog: AdminDataDialog<ProductoTabla> = {
      editar: true,
      elemento: producto
    }
    const dialogRef = this.dialog.open(ProductosDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        const productoResultado: ProductoPOST = {
          descripcion: resultado.data.descripcion,
          imagen: this._productoService.getProductoImagenPath(
            resultado.data.imagen
          ),
          precio: resultado.data.precio,
          stock: resultado.data.stock,
          id_tipoProducto: resultado.data.id_tipoProducto,
          detalle: resultado.data.detalle
        }
        this._productoService
          .updateProducto(producto.id_producto, productoResultado)
          .subscribe({
            // next - error - complete
            next: (res: any) => {
              const dialogRef = this.dialog.open(DialogComponent, {
                width: '375px',
                autoFocus: true,
                data: {
                  title: 'Editar producto',
                  msg: res.msg
                }
              })
              dialogRef.afterClosed().subscribe(() => {
                window.location.href = '/admin/productos'
              })
            },
            error: (err) => {
              this.dialog.open(DialogComponent, {
                width: '300 px',
                data: {
                  title: 'Error',
                  msg: err.error.msg
                }
              })
            }
          })
      }
    })
  }

  onAdd() {
    const dataDialog: AdminDataDialog<ProductoTabla> = {
      editar: false
    }
    const dialogRef = this.dialog.open(ProductosDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        const productoResultado: ProductoPOST = {
          descripcion: resultado.data.descripcion,
          imagen: resultado.data.imagen, // Las imagenes tienen que estar guardadas dentro del repositorio del proyecto
          precio: resultado.data.precio,
          stock: resultado.data.stock,
          id_tipoProducto: resultado.data.id_tipoProducto,
          detalle: resultado.data.detalle
        }
        this._productoService.createProducto(productoResultado).subscribe({
          // next - error - complete
          next: (res: any) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Agregar producto',
                msg: res.msg
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/admin/productos'
            })
          },
          error: (err) => {
            this.dialog.open(DialogComponent, {
              width: '300 px',
              data: {
                title: 'Error',
                msg: err.error.msg
              }
            })
          }
        })
      }
    })
  }
}
