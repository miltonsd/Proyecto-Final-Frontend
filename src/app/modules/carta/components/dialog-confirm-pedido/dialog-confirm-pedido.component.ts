import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-dialog-confirm-pedido',
  templateUrl: './dialog-confirm-pedido.component.html',
  styleUrls: ['./dialog-confirm-pedido.component.css']
})
export class DialogConfirmPedidoComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  calcularTotal() {
    let monto = 0
    this.data.carrito.forEach((producto: any) => {
      monto += producto.precio * producto.cant_selecc
    })
    return monto
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
