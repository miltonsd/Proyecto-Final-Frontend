import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CategoriaForm, CategoriaPOST } from '../../views/categorias/models'

@Component({
  selector: 'pa-categorias-dialog',
  templateUrl: './categorias-dialog.component.html',
  styleUrls: ['./categorias-dialog.component.css']
})
export class CategoriasDialogComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.data.editar) {
      this.cargarFormulario()
    }
  }

  cargarFormulario() {
    const categoria: CategoriaForm = {
      descripcion: this.data.elemento?.descripcion
    }
    this.formulario.patchValue({
      descripcion: categoria.descripcion
    })
  }

  onSubmit() {
    if (this.formulario.valid) {
      const categoria: CategoriaPOST = {
          descripcion: this.formulario.value.descripcion as string
        }
        this.dialogRef.close({ data: categoria })
      } else {
        this.formulario.markAllAsTouched()
    }
  }
}
