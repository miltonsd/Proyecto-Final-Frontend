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

  montoImporte = this.calcularTotal()

  calcularTotal() {
    let monto = 0
    this.data.carrito.forEach((producto: any) => {
      monto += producto.precio * producto.cant_selecc
    })
    return monto
  }

  onSubmit() {
    // Obtiene el valor del textarea de observación. Si está vacío, asigna 'No hay.'
    const element = document.getElementById('observacion')
    const observacion = (element as HTMLTextAreaElement).value || 'No hay.'
    // Cierra el dialog y devuelve el monto total y observación del pedido realizado
    this.dialogRef.close({
      confirmado: true,
      montoImporte: this.montoImporte,
      observacion
    })
  }

  onNoClick(): void {
    this.dialogRef.close({ confirmado: false })
  }
}
