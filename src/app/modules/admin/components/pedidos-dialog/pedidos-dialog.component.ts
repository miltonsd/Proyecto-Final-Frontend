import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-pedidos-dialog',
  templateUrl: './pedidos-dialog.component.html',
  styleUrls: ['./pedidos-dialog.component.css']
})
export class PedidosDialogComponent {
  pedido!: any

  constructor(
    public dialogRef: MatDialogRef<PedidosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    fechaHora: new FormControl('', {
      validators: [Validators.required]
    }),
    montoImporte: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto pedido al padre / Si 'editar' -> No valide pero que pase el objeto pedido al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.pedido = {
          fechaHora: this.formulario.value.fechaHora,
          montoImporte: this.formulario.value.montoImporte
        }
        this.dialogRef.close({ data: this.pedido })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.pedido = {
        fechaHora:
          this.formulario.value.fechaHora || this.data.tipoProducto.fechaHora,
        montoImporte:
          this.formulario.value.montoImporte || this.data.tipoProducto.imagen
      }
      this.dialogRef.close({ data: this.pedido })
    }
  }
}
