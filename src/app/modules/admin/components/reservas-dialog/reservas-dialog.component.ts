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
  lista_mesas!: any[]
  usuarios!: any[]
  isPendiente = new FormControl(true)
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

  constructor(
    public dialogRef: MatDialogRef<ReservasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    // fechaHora: new FormControl('', {
    //   validators: [Validators.required]
    // }),
    // cant_personas: new FormControl('', {
    //   validators: [Validators.required]
    // }),
    isPendiente: this.isPendiente,
    usuario: new FormControl('', {
      validators: [Validators.required]
    }),
    mesa: new FormControl('', {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    console.log(this.data)
    this._mesaService
      .getAllMesas()
      .pipe(
        map((res: any) => {
          this.mesas = Object.keys(res).map((m) => ({
            id_mesa: res[m].id_mesa,
            capacidad: res[m].capacidad,
            ubicacion: res[m].ubicacion,
            available: true
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
          this.lista_mesas = this.mesas
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Controla si hubo cambios en el input de hora
    this.formulario
      .get('fechaHoraCantidad')
      ?.valueChanges.subscribe((valor) => {
        if (valor.cantidad != 0) {
          const cantidad = valor.cantidad || 1
          const fechaHora =
            moment(valor.fecha).format('DD/MM/yyyy') + ' ' + valor.hora
          // Filtra las reservas pendientes por la fecha y hora ingresadas
          const reservasFiltradas = this.data.lista_reservas.filter(
            (r: any) => r.fechaHora === fechaHora
          )
          this.mesas.forEach((mesa) => {
            if (mesa.capacidad < cantidad) {
              mesa.available = false
            } else {
              mesa.available = true
            }
          })
          reservasFiltradas.forEach((reserva: any) => {
            // Si existen reservas para esa fecha y hora, asigna las mesas correpondientes como ocupadas
            const posMesa = reserva.id_mesa - 1
            this.mesas[posMesa].available = false
          })
          this.lista_mesas = this.mesas.filter((mesa) => mesa.available)
          console.log('Lista Mesas:', this.lista_mesas)
        }
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
          fechaHora:
            moment(this.formulario.value.fechaHoraCantidad?.fecha).format(
              'yyyy-MM-DD'
            ) +
            ' ' +
            this.formulario.value.fechaHoraCantidad?.hora,
          cant_personas: this.formulario.value.fechaHoraCantidad?.cantidad,
          isPendiente: this.formulario.value.isPendiente,
          id_usuario: this.formulario.value.usuario,
          id_mesa: this.formulario.value.mesa
        }
        this.dialogRef.close({ data: this.reserva })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      // Aun no funciona
      this.reserva = {
        fechaHora:
          moment(this.formulario.value.fechaHoraCantidad?.fecha).format(
            'yyyy-MM-DD'
          ) +
            ' ' +
            this.formulario.value.fechaHoraCantidad?.hora ||
          this.data.reserva.fechaHora,
        cant_personas:
          this.formulario.value.fechaHoraCantidad?.cantidad ||
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
