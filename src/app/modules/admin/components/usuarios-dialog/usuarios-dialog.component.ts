import { Component, Inject, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { RolesService } from '../../services/roles.service'
import { CategoriasService } from '../../services/categorias.service'
import { map } from 'rxjs'

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
        Validators.maxLength(50),
        // Validators.pattern('[/^[a-zA-ZáéíóúÁÉÍÓÚ\\s]+$/]*')
      ]
    }),
    apellido: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
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
    fechaNacimiento: new FormControl(new Date(), {
      validators: [Validators.required]
    }),
    rol: new FormControl('', {
      validators: [Validators.required]
    }),
    categoria: new FormControl('', {
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
        this.usuario = {
          nombre: this.formulario.value.nombre,
          apellido: this.formulario.value.apellido,
          email: this.formulario.value.email,
          contraseña: this.formulario.value.password,
          isConfirmado: this.formulario.value.isConfirmado || false,
          documento: this.formulario.value.documento,
          direccion: this.formulario.value.direccion,
          telefono: this.formulario.value.telefono,
          fechaNacimiento: moment(this.formulario.value.fechaNacimiento).format(
            'yyyy-MM-DD'
          ),
          id_rol: this.formulario.value.rol || 2,
          id_categoria: this.formulario.value.categoria || 1
        }
        this.dialogRef.close({ data: this.usuario })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.usuario = {
        nombre: this.formulario.value.nombre || this.data.usuario.nombre,
        apellido: this.formulario.value.apellido || this.data.usuario.apellido,
        email: this.formulario.value.email || this.data.usuario.email,
        contraseña:
          this.formulario.value.password || this.data.usuario.contraseña,
        isConfirmado:
          this.formulario.value.isConfirmado || this.data.usuario.isConfirmado,
        documento:
          this.formulario.value.documento || this.data.usuario.documento,
        direccion:
          this.formulario.value.direccion || this.data.usuario.direccion,
        telefono: this.formulario.value.telefono || this.data.usuario.telefono,
        fechaNacimiento:
          moment(this.formulario.value.fechaNacimiento).format('yyyy-MM-DD') ||
          this.data.usuario.fechaNacimiento,
        id_rol: this.formulario.value.rol || this.data.usuario.id_rol,
        id_categoria:
          this.formulario.value.categoria || this.data.usuario.id_categoria
      }
      this.dialogRef.close({ data: this.usuario })
    }
  }
}
