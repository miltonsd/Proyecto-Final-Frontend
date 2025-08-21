import { Component, Inject, OnInit } from '@angular/core'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-dialog-editar-perfil',
  templateUrl: './dialog-editar-perfil.component.html',
  styleUrls: ['./dialog-editar-perfil.component.css']
})
export class DialogEditarPerfilComponent implements OnInit {
  ocultar = true
  constructor(
    public dialogRef: MatDialogRef<DialogEditarPerfilComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  formulario = new FormGroup({
    nombre: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[a-zA-Z ]*')]
    }),
    apellido: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[a-zA-Z ]*')]
    }),
    direccion: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    telefono: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[0-9]*')]
    }),
    contrasenia: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]
    })
    // confirmarContrasenia: new FormControl('', {
    //   validators: [
    //     Validators.required,
    //     Validators.minLength(6),
    //     Validators.maxLength(20)
    //   ]
    // })
  })

  ngOnInit() {
    console.log(this.data)
    this.cargarFormulario()
  }

  cargarFormulario() {
    const perfilData = {
      nombre: this.data.nombre,
      apellido: this.data.apellido,
      direccion: this.data.direccion,
      telefono: this.data.telefono
    }
    this.formulario.patchValue({
      nombre: perfilData.nombre,
      apellido: perfilData.apellido,
      direccion: perfilData.direccion,
      telefono: perfilData.telefono
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      const perfilActualizado = {
        nombre: this.formulario.value.nombre as string,
        apellido: this.formulario.value.apellido as string,
        direccion: this.formulario.value.direccion as string,
        telefono: this.formulario.value.telefono as string,
        contrasenia: this.formulario.value.contrasenia as string
      }
      this.dialogRef.close({ data: perfilActualizado })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
