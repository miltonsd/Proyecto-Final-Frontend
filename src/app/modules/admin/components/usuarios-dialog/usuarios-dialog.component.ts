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
  ocultar = true
  maxDate = new Date(
    new Date().getFullYear() - 15,
    new Date().getMonth(),
    new Date().getDate()
  )

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
    password: new FormControl(''),
    isConfirmado: new FormControl(false),
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
      validators: [Validators.required, Validators.min(1)]
    }),
    categoria: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)]
    }),
    cambiarPass: new FormControl(false)
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
          } else {
            // Si se crea un usuario, le agrega el Validator required al password del formulario y actualiza el mismo para que se vean reflejados los cambios
            const passwordControl = this.formulario.get('password')
            passwordControl?.setValidators([Validators.required])
            passwordControl?.updateValueAndValidity()
          }
        },
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  cargarFormulario() {
    const usuario: UsuarioForm = {
      nombre: this.data.elemento?.nombre as string,
      apellido: this.data.elemento?.apellido as string,
      email: this.data.elemento?.email as string,
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
      isConfirmado: usuario.isConfirmado,
      documento: usuario.documento,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      fechaNacimiento: usuario.fechaNacimiento,
      rol: usuario.rol,
      categoria: usuario.categoria
    })

    // Suscribirse a los cambios del checkbox "¿Cambiar contraseña?"
    this.formulario.get('cambiarPass')?.valueChanges.subscribe((value) => {
      const passwordControl = this.formulario.get('password')

      if (value) {
        // Si el checkbox está marcado, agregar el validador 'required' del campo de contraseña
        passwordControl?.setValidators([Validators.required])
      } else {
        // Si el checkbox está desmarcado, quita el validador al campo de contraseña
        passwordControl?.clearValidators()
      }
      // Actualiza el estado del formulario para que refleje los cambios realizados
      passwordControl?.updateValueAndValidity()
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
        isConfirmado: this.formulario.value.isConfirmado as boolean,
        documento: this.formulario.value.documento as string,
        direccion: this.formulario.value.direccion as string,
        telefono: this.formulario.value.telefono as string,
        fechaNacimiento: moment(
          this.formulario.value.fechaNacimiento,
          'yyyy-MM-DD'
        ).format(),
        id_rol: this.formulario.value.rol as number,
        id_categoria: this.formulario.value.categoria as number
      }
      if (this.formulario.get('cambiarPass')?.value || !this.data.editar) {
        // Si el checkbox está marcado o el formulario es para crear un usuario, incluir la contraseña en el objeto a enviar al backend
        usuario['contraseña'] = this.formulario.value.password as string
      }
      this.dialogRef.close({ data: usuario })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
