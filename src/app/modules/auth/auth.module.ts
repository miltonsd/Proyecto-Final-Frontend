import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { AuthRoutingModule } from '@pa/auth/auth-routing.module'
import { AuthComponent } from '@pa/auth/auth.component'
import { LoginComponent } from '@pa/auth/components/login/login.component'
import { RegisterComponent } from '@pa/auth/components/register/register.component'
import { ResetPasswordComponent } from '@pa/auth/components/reset-password/reset-password.component'
import { ComponentsModule, MaterialModule } from '@pa/shared/modules'

const modules = [ComponentsModule, MaterialModule]

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, ...modules]
})
export class AuthModule {}
