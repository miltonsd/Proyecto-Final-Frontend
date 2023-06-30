import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { RolForm, RolPOST } from '../../views/roles/models' 

@Component({
  selector: 'pa-roles-dialog',
  templateUrl: './roles-dialog.component.html',
  styleUrls: ['./roles-dialog.component.css']
})
export class RolesDialogComponent implements OnInit {
  rol!: any

  constructor(
    public dialogRef: MatDialogRef<RolesDialogComponent>,
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
    const rol: RolForm = {
      descripcion: this.data.elemento?.descripcion
    }
    this.formulario.patchValue({
      descripcion: rol.descripcion
    })
  }

  onSubmit() {
    if (this.formulario.valid) {
      const rol: RolPOST = {
          descripcion: this.formulario.value.descripcion as string
        }
        this.dialogRef.close({ data: rol })
      } else {
        this.formulario.markAllAsTouched()
    }
  }
}