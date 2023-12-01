import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-dialog-detalle-producto',
  templateUrl: './dialog-detalle-producto.component.html',
  styleUrls: ['./dialog-detalle-producto.component.css']
})
export class DialogDetalleProductoComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDetalleProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close()
  }
}
