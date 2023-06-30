import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MesaForm, MesaPOST } from '@pa/mesas/models'

@Component({
  selector: 'pa-mesas-dialog',
  templateUrl: './mesas-dialog.component.html',
  styleUrls: ['./mesas-dialog.component.css']
})
export class MesasDialogComponent implements OnInit {
  mesa!: any

  constructor(
    public dialogRef: MatDialogRef<MesasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    capacidad: new FormControl(0, {
      validators: [Validators.required]
    }),
    ubicacion: new FormControl('', {
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
    const mesa: MesaForm = {
      capacidad: this.data.elemento?.capacidad,
      ubicacion: this.data.elemento?.ubicacion
    }
    this.formulario.patchValue({
      capacidad: mesa.capacidad,
      ubicacion: mesa.ubicacion
    })
  }

  onSubmit() {
    if (this.formulario.valid) {
      const mesa: MesaPOST = {
          capacidad: this.formulario.value.capacidad as number,
          ubicacion: this.formulario.value.ubicacion as string,
        }
        this.dialogRef.close({ data: mesa })
      } else {
        this.formulario.markAllAsTouched()
    }
  }
}
