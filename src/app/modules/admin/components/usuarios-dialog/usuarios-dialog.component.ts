import { Component, Inject, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { RolesService } from '../../services/roles.service'
import { CategoriasService } from '../../services/categorias.service'
import { map } from 'rxjs'
import {
  UsuarioForm,
  UsuarioPOST
} from 'src/app/modules/usuarios/models/usuarios'

@Component({
  selector: 'pa-usuarios-dialog',
  templateUrl: './usuarios-dialog.component.html',
  styleUrls: ['./usuarios-dialog.component.css']
})
export class UsuariosDialogComponent implements OnInit {
  usuario!: any
  roles!: any[]
  categorias!: any[]
  isConfirmado = new FormControl(false)
  horas = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

  constructor(
    public dialogRef: MatDialogRef<UsuariosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _rolService: RolesService,
    private _categoriaService: CategoriasService
  ) {}

  formulario = new FormGroup({
    nombre: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
        // Validators.pattern('[/^[a-zA-ZáéíóúÁÉÍÓÚ\\s]+$/]*')
      ]
    }),
    apellido: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
        // Validators.pattern('[/^[a-zA-ZáéíóúÁÉÍÓÚ\\s]+$/]*')
      ]
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]
    }),
    password: new FormControl('', {
      validators: [Validators.required]
    }),
    isConfirmado: this.isConfirmado,
    documento: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.minLength(7),
        Validators.maxLength(8)
      ]
    }),
    direccion: new FormControl('', {
      validators: [Validators.required]
    }),
    telefono: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[0-9]*')]
    }),
    fechaNacimiento: new FormControl('', {
      validators: [Validators.required]
    }),
    rol: new FormControl(0, {
      validators: [Validators.required]
    }),
    categoria: new FormControl(0, {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    this._rolService
      .getAllRoles()
      .pipe(
        map((res: any) => {
          this.roles = Object.keys(res).map((r) => ({
            id_rol: res[r].id_rol,
            descripcion: res[r].descripcion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    this._categoriaService
      .getAllCategorias()
      .pipe(
        map((res: any) => {
          this.categorias = Object.keys(res).map((c) => ({
            id_categoria: res[c].id_categoria,
            descripcion: res[c].descripcion
          }))
        })
      )
      .subscribe({
        next: () => {
          if (this.data.editar) {
            this.cargarFormulario()
          }
        },
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  cargarFormulario() {
    console.log(this.data.elemento)
    const usuario: UsuarioForm = {
      nombre: this.data.elemento?.nombre as string,
      apellido: this.data.elemento?.apellido as string,
      email: this.data.elemento?.email as string,
      password: this.data.elemento?.password as string,
      isConfirmado: this.data.elemento?.isConfirmado as boolean,
      documento: this.data.elemento?.documento as string,
      direccion: this.data.elemento?.direccion as string,
      telefono: this.data.elemento?.telefono as string,
      fechaNacimiento: moment(
        this.data.elemento?.fechaNacimiento,
        'DD/MM/yyyy',
        false
      ).format(),
      rol: this.data.elemento?.id_rol as number,
      categoria: this.data.elemento?.id_categoria as number
    }
    this.formulario.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: usuario.password,
      isConfirmado: usuario.isConfirmado,
      documento: usuario.documento,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      fechaNacimiento: usuario.fechaNacimiento,
      rol: usuario.rol,
      categoria: usuario.categoria
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      const usuario: UsuarioPOST = {
        nombre: this.formulario.value.nombre as string,
        apellido: this.formulario.value.apellido as string,
        email: this.formulario.value.email as string,
        password: this.formulario.value.password as string,
        isConfirmado: this.formulario.value.isConfirmado as boolean,
        documento: this.formulario.value.documento as string,
        direccion: this.formulario.value.direccion as string,
        telefono: this.formulario.value.telefono as string,
        fechaNacimiento: moment(
          this.formulario.value.fechaNacimiento,
          'yyyy-MM-DD'
        ).format(),
        rol: this.formulario.value.rol as number,
        categoria: this.formulario.value.categoria as number
      }
      this.dialogRef.close({ data: usuario })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
