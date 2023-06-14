import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-categorias-dialog',
  templateUrl: './categorias-dialog.component.html',
  styleUrls: ['./categorias-dialog.component.css']
})
export class CategoriasDialogComponent {
  categoria!: any

  constructor(
    public dialogRef: MatDialogRef<CategoriasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    descripcion: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto categoria al padre / Si 'editar' -> No valide pero que pase el objeto categoria al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.categoria = {
          descripcion: this.formulario.value.descripcion
        }
        this.dialogRef.close({ data: this.categoria })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.categoria = {
        descripcion:
          this.formulario.value.descripcion || this.data.categoria.descripcion
      }
      this.dialogRef.close({ data: this.categoria })
    }
  }
}
