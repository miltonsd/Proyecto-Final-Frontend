import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-menues-dialog',
  templateUrl: './menues-dialog.component.html',
  styleUrls: ['./menues-dialog.component.css']
})
export class MenuesDialogComponent {
  menu!: any

  constructor(
    public dialogRef: MatDialogRef<MenuesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    titulo: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto menu al padre / Si 'editar' -> No valide pero que pase el objeto menu al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.menu = {
          titulo: this.formulario.value.titulo
        }
        this.dialogRef.close({ data: this.menu })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.menu = {
        titulo: this.formulario.value.titulo || this.data.tipoProducto.titulo
      }
      this.dialogRef.close({ data: this.menu })
    }
  }
}
