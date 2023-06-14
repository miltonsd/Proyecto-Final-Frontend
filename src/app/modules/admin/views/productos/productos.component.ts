import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { ProductosService } from '@pa/carta/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { ProductosDialogComponent } from '../../components/productos-dialog/productos-dialog.component'

@Component({
  selector: 'pa-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

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
            imagen: res[p].imagen,
            tipoProducto: res[p].TipoProducto.descripcion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Productos
    this.columnas = [
      { name: 'ID', dataKey: 'id_producto' },
      {
        name: 'Precio unitario',
        dataKey: 'precio',
        isCurrency: true
      },
      { name: 'Stock', dataKey: 'stock' },
      { name: 'Descripción', dataKey: 'descripcion' },
      { name: 'Imágen', dataKey: 'imagen', isImage: true },
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
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar producto',
            msg: 'Se ha eliminado el producto con éxito.'
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

  onEdit(producto: any) {
    const dialogRef = this.dialog.open(ProductosDialogComponent, {
      width: '900px',
      data: {
        producto,
        accion: 'editar'
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._productoService
          .updateProducto(producto.id_producto, resultado.data)
          .subscribe({
            // next - error - complete
            next: (respuesta: any) => {
              alert(respuesta.msg)
              window.location.href = '/admin/productos'
            },
            error: (err) => {
              alert(err.msg)
            }
          })
      }
    })
  }

  onAdd() {
    const dialogRef = this.dialog.open(ProductosDialogComponent, {
      width: '900px',
      data: {
        accion: 'agregar'
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._productoService.createProducto(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            alert(respuesta.msg)
            window.location.href = '/admin/productos'
          },
          error: (err) => {
            alert(err.msg)
          }
        })
      }
    })
  }
}
