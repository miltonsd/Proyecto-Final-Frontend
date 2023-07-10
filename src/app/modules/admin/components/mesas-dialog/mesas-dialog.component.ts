import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MesaForm, MesaPOST } from '@pa/mesas/models'
import { MesasService } from '@pa/mesas/services'

@Component({
  selector: 'pa-mesas-dialog',
  templateUrl: './mesas-dialog.component.html',
  styleUrls: ['./mesas-dialog.component.css']
})
export class MesasDialogComponent implements OnInit {
  mesa!: any

  constructor(
    public dialogRef: MatDialogRef<MesasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mesaService: MesasService
  ) {}

  formulario = new FormGroup({
    capacidad: new FormControl(2, {
      validators: [Validators.required, Validators.min(2), Validators.max(6)]
    }),
    ubicacion: new FormControl('', {
      validators: [Validators.required]
    }),
    qr: new FormControl('', { validators: [Validators.required] })
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
      ubicacion: this.data.elemento?.ubicacion,
      qr: this.data.elemento?.qr
    }
    this.formulario.patchValue({
      capacidad: mesa.capacidad,
      ubicacion: mesa.ubicacion,
      qr: mesa.qr
    })
  }

  onSubmit() {
    if (this.formulario.valid) {
      const mesa: MesaPOST = {
        capacidad: this.formulario.value.capacidad as number,
        ubicacion: this.formulario.value.ubicacion as string,
        // qr: !this.data.editar ? '' : (this.formulario.value.qr as string)
        qr: this.formulario.value.qr as string
      }
      this.dialogRef.close({ data: mesa })
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  generarQR() {
    if (this.data.elemento.qr !== '') {
      console.log('NO HAGO NADA')
    } else {
      this._mesaService
        .generarQR(this.data.elemento.id_mesa)
        .then((qrCodeUrl: string) => {
          // Realizar acciones adicionales si es necesario
          console.log('Código QR generado:', qrCodeUrl)
          // const base64Image = qrCodeUrl.replace(
          //   /^data:image\/(png|jpeg|jpg);base64,/,
          //   ''
          // )
          this.formulario.patchValue({
            qr: qrCodeUrl
          })
        })
        .catch((error: any) => {
          console.error(error)
          // Manejar el error en caso de que ocurra
        })
    }
  }

  eliminarQR() {
    if (this.data.elemento.qr !== '') {
      this.data.elemento.qr = ''
      this.formulario.patchValue({ qr: '' })
    } else {
      console.log('NO HAGO NADA')
    }
  }
}
