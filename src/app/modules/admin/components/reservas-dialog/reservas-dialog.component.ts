import { Component, Inject, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Observable, map } from 'rxjs'
import { UsuariosService } from '@pa/usuarios/services'
import { MesasService } from '@pa/mesas/services'
import {
  ReservaData,
  ReservaForm,
  ReservaPOST,
  ReservaTabla
} from '@pa/reservas/models'
import { ReservaDataDialog } from '@pa/admin/models'
import { Mesa } from '@pa/mesas/models'
import { Usuario } from '@pa/usuarios/models'

@Component({
  selector: 'pa-reservas-dialog',
  templateUrl: './reservas-dialog.component.html',
  styleUrls: ['./reservas-dialog.component.css']
})
export class ReservasDialogComponent implements OnInit {
  mesas: Mesa[] = []
  listaMesas: Mesa[] = []
  usuarios: Usuario[] = []
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

  constructor(
    public dialogRef: MatDialogRef<ReservasDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ReservaDataDialog<ReservaTabla, ReservaData>,
    private _mesaService: MesasService,
    private _usuarioService: UsuariosService
  ) {}

  formulario = new FormGroup({
    fechaHoraCantidad: new FormGroup({
      fecha: new FormControl('', { validators: [Validators.required] }),
      hora: new FormControl('', { validators: [Validators.required] }),
      cantidad: new FormControl(1, {
        validators: [Validators.required, Validators.min(1), Validators.max(6)]
      })
    }),
    isPendiente: new FormControl(true),
    usuario: new FormControl<number>(0, {
      validators: [Validators.required, Validators.min(1)]
    }),
    mesa: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)]
    })
  })

  ngOnInit() {
    this.cargarUsuarios()
    this.cargarMesas().subscribe({
      next: () => {
        this.listaMesas = this.mesas
        this.detectarCambios()
        if (this.data.editar) {
          this.cargarFormulario()
        }
      },
      error: (err) =>
        console.error(`Código de error ${err.status}: `, err.error.msg)
    })
  }

  cargarUsuarios() {
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
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  cargarMesas(): Observable<void> {
    return this._mesaService.getAllMesas().pipe(
      map((res: any) => {
        this.mesas = Object.keys(res).map((m) => ({
          id_mesa: res[m].id_mesa,
          capacidad: res[m].capacidad,
          ubicacion: res[m].ubicacion,
          habilitada: true
        }))
      })
    )
  }

  detectarCambios() {
    this.formulario.get('fechaHoraCantidad')?.valueChanges.subscribe({
      next: (valor) => {
        if (valor.fecha !== '' && valor.hora !== '') {
          const fecha = moment(valor.fecha).format('DD/MM/yyyy')
          const fechaHora = fecha + ' ' + valor.hora
          const cantidad = valor.cantidad as number
          // Filtra las reservas pendientes por la fecha y hora
          const reservas = this.data.listaElementos?.filter(
            (r) => r.fechaHora === fechaHora
          )
          this.mesas.forEach((mesa) => {
            if (mesa.capacidad < cantidad) {
              mesa.habilitada = false
            } else {
              mesa.habilitada = true
            }
          })
          console.log(reservas)
          reservas?.forEach((reserva) => {
            // Asigna las mesas para las reservas existentes en esa fecha y hora como ocupadas
            const posMesa = reserva.id_mesa - 1
            this.mesas[posMesa].habilitada = false
          })
          // Filtra las mesas disponibles para que se puedan seleccionar en el formulario
          this.listaMesas = this.mesas.filter((mesa) => mesa.habilitada)
        }
      }
    })
  }

  cargarFormulario() {
    const reserva: ReservaForm = {
      fecha: this.data.elemento?.fechaHora.slice(0, 10) as string,
      hora: this.data.elemento?.fechaHora.slice(11) as string,
      cant_personas: this.data.elemento?.cant_personas as number,
      isPendiente: this.data.elemento?.isPendiente as boolean,
      id_usuario: this.data.elemento?.id_usuario as number,
      id_mesa: this.data.elemento?.id_mesa as number
    }
    this.formulario.patchValue({
      fechaHoraCantidad: {
        fecha: moment(reserva.fecha, 'DD/MM/yyyy', false).format(), // Forgiving mode (los formatos de fechas son distintos)
        hora: reserva.hora,
        cantidad: reserva.cant_personas
      },
      isPendiente: reserva.isPendiente,
      usuario: reserva.id_usuario,
      mesa: reserva.id_mesa
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      const reserva: ReservaPOST = {
        fechaHora:
          moment(this.formulario.value.fechaHoraCantidad?.fecha).format(
            'yyyy-MM-DD'
          ) +
          ' ' +
          this.formulario.value.fechaHoraCantidad?.hora,
        cant_personas: this.formulario.value.fechaHoraCantidad
          ?.cantidad as number,
        isPendiente: this.formulario.value.isPendiente as boolean,
        id_usuario: this.formulario.value.usuario as number,
        id_mesa: this.formulario.value.mesa as number
      }
      this.dialogRef.close({ data: reserva })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
