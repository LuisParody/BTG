import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { FondosService } from "../../services/fondos.service";
import { TransaccionesService } from "../../services/transacciones.service";
import { AuthService } from "../../services/auth.service";
import { Fondo } from "../../models";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: "app-fondos",
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: "./fondos.component.html",
  styleUrls: ["./fondos.component.css"],
})
export class FondosComponent implements OnInit {
  fondos: Fondo[] = [];
  fondosFiltrados: Fondo[] = [];
  fondosSuscritos: string[] = [];
  categoriaSeleccionada = "Todas";
  busqueda = "";
  loading = true;

  fondoSeleccionado: Fondo | null = null;
  montoSuscripcion = 0;
  metodoNotificacion: "email" | "sms" = "email";
  showModal = false;
  errorMessage = "";
  successMessage = "";
  procesando = false;

  constructor(
    private fondosService: FondosService,
    private transaccionesService: TransaccionesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFondos();
    this.cargarFondosSuscritos();
  }

  cargarFondos(): void {
    this.fondosService.getFondos().subscribe((fondos) => {
      this.fondos = fondos;
      this.fondosFiltrados = fondos;
      this.loading = false;
    });
  }

  cargarFondosSuscritos(): void {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      this.transaccionesService
        .getFondosSuscritos(usuario.id)
        .subscribe((fondosIds) => {
          this.fondosSuscritos = fondosIds;
        });
    }
  }

  filtrarPorCategoria(): void {
    if (this.categoriaSeleccionada === "Todas") {
      this.fondosFiltrados = this.fondos;
    } else {
      this.fondosFiltrados = this.fondos.filter(
        (f) => f.categoria === this.categoriaSeleccionada
      );
    }
    this.aplicarBusqueda();
  }

  aplicarBusqueda(): void {
    if (!this.busqueda.trim()) {
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.fondosFiltrados = this.fondosFiltrados.filter(
      (f) =>
        f.nombre.toLowerCase().includes(termino) ||
        f.descripcion.toLowerCase().includes(termino)
    );
  }

  buscar(): void {
    this.filtrarPorCategoria();
  }

  estasSuscrito(fondoId: string): boolean {
    return this.fondosSuscritos.includes(fondoId);
  }

  abrirModalSuscripcion(fondo: Fondo): void {
    this.fondoSeleccionado = fondo;
    this.montoSuscripcion = fondo.montoMinimo;
    this.metodoNotificacion = "email";
    this.showModal = true;
    this.errorMessage = "";
    this.successMessage = "";
  }

  cerrarModal(): void {
    this.showModal = false;
    this.fondoSeleccionado = null;
    this.montoSuscripcion = 0;
    this.metodoNotificacion = "email";
    this.errorMessage = "";
    this.successMessage = "";
  }

  suscribirse(): void {
    if (!this.fondoSeleccionado) return;

    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.errorMessage = "Debe iniciar sesión";
      return;
    }

    if (this.montoSuscripcion < this.fondoSeleccionado.montoMinimo) {
      this.errorMessage = `El monto mínimo es $${this.fondoSeleccionado.montoMinimo.toLocaleString(
        "es-CO"
      )}`;
      return;
    }

    if (this.montoSuscripcion > usuario.saldo) {
      this.errorMessage = "Saldo insuficiente";
      return;
    }

    if (!this.metodoNotificacion) {
      this.errorMessage = "Debe seleccionar un método de notificación";
      return;
    }

    this.procesando = true;
    this.errorMessage = "";

    this.transaccionesService
      .suscribirFondo(
        this.fondoSeleccionado.id,
        this.fondoSeleccionado.nombre,
        this.montoSuscripcion,
        this.metodoNotificacion
      )
      .subscribe({
        next: (transaccion) => {
          this.procesando = false;
          this.successMessage =
            transaccion.notificacion || "Suscripción exitosa";
          this.cargarFondosSuscritos();

          setTimeout(() => {
            this.cerrarModal();
            this.router.navigate(["/dashboard"]);
          }, 2000);
        },
        error: (error) => {
          this.procesando = false;
          this.errorMessage = error.message || "Error al suscribirse";
        },
      });
  }

  cancelarSuscripcion(fondo: Fondo): void {
    if (
      !confirm(
        `¿Está seguro de cancelar la suscripción al fondo ${fondo.nombre}?`
      )
    ) {
      return;
    }

    this.procesando = true;

    this.transaccionesService
      .cancelarSuscripcion(fondo.id, fondo.nombre)
      .subscribe({
        next: (transaccion) => {
          this.procesando = false;
          alert(transaccion.notificacion);
          this.cargarFondosSuscritos();
        },
        error: (error) => {
          this.procesando = false;
          alert(error.message || "Error al cancelar suscripción");
        },
      });
  }

  getRiesgoClass(riesgo: string): string {
    return `riesgo-${riesgo.toLowerCase()}`;
  }
}
