import { Component, Inject, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { map } from 'rxjs'
import { UsuariosService } from '@pa/usuarios/services'
import { MesasService } from '@pa/mesas/services'

@Component({
  selector: 'pa-reservas-dialog',
  templateUrl: './reservas-dialog.component.html',
  styleUrls: ['./reservas-dialog.component.css']
})
export class ReservasDialogComponent implements OnInit {
  reserva!: any
  mesas!: any[]
  usuarios!: any[]
  isPendiente = new FormControl(true)

  constructor(
    public dialogRef: MatDialogRef<ReservasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _mesaService: MesasService,
    private _usuarioService: UsuariosService
  ) {}

  formulario = new FormGroup({
    fechaHora: new FormControl('', {
      validators: [Validators.required]
    }),
    cant_personas: new FormControl('', {
      validators: [Validators.required]
    }),
    isPendiente: this.isPendiente,
    usuario: new FormControl('', {
      validators: [Validators.required]
    }),
    mesa: new FormControl('', {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    this._mesaService
      .getAllMesas()
      .pipe(
        map((res: any) => {
          this.mesas = Object.keys(res).map((m) => ({
            id_mesa: res[m].id_mesa,
            capacidad: res[m].capacidad,
            descripcion: res[m].descripcion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    this._usuarioService
      .getAllUsuarios()
      .pipe(
        map((res: any) => {
          this.usuarios = Object.keys(res).map((u) => ({
            id_usuario: res[u].id_usuario,
            nombre: res[u].nombre + ' ' + res[u].apellido
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    console.log(this.formulario)
    // Si 'agregar' -> Valide el form y pasar el objeto tipoProducto al padre / Si 'editar' -> No valide pero que pase el objeto tipoProducto al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.reserva = {
          fechaHora: moment(this.formulario.value.fechaHora).format(
            'yyyy-MM-DD hh:MM'
          ),
          cant_personas: this.formulario.value.cant_personas,
          isPendiente: this.formulario.value.isPendiente,
          id_usuario: this.formulario.value.usuario,
          id_mesa: this.formulario.value.mesa
        }
        this.dialogRef.close({ data: this.reserva })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.reserva = {
        fechaHora:
          moment(this.formulario.value.fechaHora).format('yyyy-MM-DD hh:MM') ||
          this.data.reserva.fechaHora,
        cant_personas:
          this.formulario.value.cant_personas ||
          this.data.reserva.cant_personas,
        isPendiente:
          this.formulario.value.isPendiente || this.data.reserva.isPendiente,
        id_usuario: this.formulario.value.usuario || this.data.reserva.usuario,
        id_mesa: this.formulario.value.mesa || this.data.reserva.mesa
      }
      this.dialogRef.close({ data: this.reserva })
    }
  }
}
