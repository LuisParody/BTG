import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { TransaccionesService } from "../../services/transacciones.service";
import { Usuario, Transaccion } from "../../models";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  usuario: Usuario | null = null;
  transacciones: Transaccion[] = [];
  montoInvertido = 0;
  loading = true;

  constructor(
    private authService: AuthService,
    private transaccionesService: TransaccionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.usuario = user;
      if (user) {
        this.cargarDatos(user.id);
      }
    });
  }

  cargarDatos(usuarioId: string): void {
    this.transaccionesService
      .getTransaccionesByUsuario(usuarioId)
      .subscribe((transacciones) => {
        this.transacciones = transacciones.slice(0, 5); // Últimas 5 transacciones
      });

    this.transaccionesService
      .getMontoInvertido(usuarioId)
      .subscribe((monto) => {
        this.montoInvertido = monto;
        this.loading = false;
      });
  }

  navegarAFondos(): void {
    this.router.navigate(["/fondos"]);
  }

  navegarAHistorial(): void {
    this.router.navigate(["/historial"]);
  }
}
