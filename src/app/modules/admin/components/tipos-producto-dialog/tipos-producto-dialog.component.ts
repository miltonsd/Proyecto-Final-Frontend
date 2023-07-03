import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import {
  TipoProductoForm,
  TipoProductoPOST
} from '../../views/tipos-producto/models/tipo-producto'

@Component({
  selector: 'pa-tipos-producto-dialog',
  templateUrl: './tipos-producto-dialog.component.html',
  styleUrls: ['./tipos-producto-dialog.component.css']
})
export class TiposProductoDialogComponent implements OnInit {
  tipoProducto!: any

  constructor(
    public dialogRef: MatDialogRef<TiposProductoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    descripcion: new FormControl('', {
      validators: [Validators.required]
    }),
    imagen: new FormControl('', {
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
    const tipoProducto: TipoProductoForm = {
      descripcion: this.data.elemento.descripcion as string,
      imagen: this.data.elemento.imagen as string
    }
    this.formulario.patchValue({
      descripcion: tipoProducto.descripcion,
      imagen: tipoProducto.imagen
    })
  }

  onSubmit() {
    if (this.formulario.valid) {
      const tipoProducto: TipoProductoPOST = {
        descripcion: this.formulario.value.descripcion as string,
        imagen: this.formulario.value.imagen as string
      }
      this.dialogRef.close({ data: tipoProducto })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
