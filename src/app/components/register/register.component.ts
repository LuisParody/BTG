import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = "";
  loading = false;

  tiposDocumento = ["CC", "CE", "TI", "Pasaporte"];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(2)]],
      apellido: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      tipoDocumento: ["CC", Validators.required],
      numeroDocumento: ["", [Validators.required, Validators.pattern(/^\d+$/)]],
      telefono: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = "";

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || "Error al registrarse";
        },
      });
    }
  }

  get nombre() {
    return this.registerForm.get("nombre");
  }
  get apellido() {
    return this.registerForm.get("apellido");
  }
  get email() {
    return this.registerForm.get("email");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get numeroDocumento() {
    return this.registerForm.get("numeroDocumento");
  }
  get telefono() {
    return this.registerForm.get("telefono");
  }
}
