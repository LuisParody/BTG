import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TransaccionesService } from "../../services/transacciones.service";
import { AuthService } from "../../services/auth.service";
import { Transaccion } from "../../models";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: "app-historial",
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: "./historial.component.html",
  styleUrls: ["./historial.component.css"],
})
export class HistorialComponent implements OnInit {
  transacciones: Transaccion[] = [];
  loading = true;
  filtroTipo: "todas" | "apertura" | "cancelacion" = "todas";

  constructor(
    private transaccionesService: TransaccionesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      this.transaccionesService
        .getTransaccionesByUsuario(usuario.id)
        .subscribe((transacciones) => {
          this.transacciones = transacciones;
          this.loading = false;
        });
    }
  }

  get transaccionesFiltradas(): Transaccion[] {
    if (this.filtroTipo === "todas") {
      return this.transacciones;
    }
    return this.transacciones.filter((t) => t.tipo === this.filtroTipo);
  }

  getTotalSuscripciones(): number {
    return this.transacciones.filter((t) => t.tipo === "apertura").length;
  }

  getTotalCancelaciones(): number {
    return this.transacciones.filter((t) => t.tipo === "cancelacion").length;
  }

  getMontoTotalInvertido(): number {
    let total = 0;
    this.transacciones.forEach((t) => {
      if (t.tipo === "apertura") {
        total += t.monto;
      } else if (t.tipo === "cancelacion") {
        total -= t.monto;
      }
    });
    return total;
  }
}
