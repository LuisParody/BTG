import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, delay, throwError } from "rxjs";
import { map } from "rxjs/operators";
import { Transaccion } from "../models";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class TransaccionesService {
  private transacciones: Transaccion[] = [];
  private transaccionesSubject = new BehaviorSubject<Transaccion[]>([]);
  public transacciones$ = this.transaccionesSubject.asObservable();

  constructor(private authService: AuthService) {
    // Cargar transacciones del localStorage
    const saved = localStorage.getItem("transacciones");
    if (saved) {
      this.transacciones = JSON.parse(saved).map((t: any) => ({
        ...t,
        fecha: new Date(t.fecha),
      }));
      this.transaccionesSubject.next(this.transacciones);
    }
  }

  suscribirFondo(
    fondoId: string,
    fondoNombre: string,
    monto: number,
    metodoNotificacion: "email" | "sms"
  ): Observable<Transaccion> {
    const usuario = this.authService.getCurrentUser();

    if (!usuario) {
      return throwError(() => new Error("Usuario no autenticado"));
    }

    if (monto > usuario.saldo) {
      return throwError(
        () => new Error("Saldo insuficiente para realizar la suscripción")
      );
    }

    const nuevaTransaccion: Transaccion = {
      id: Date.now().toString(),
      usuarioId: usuario.id,
      fondoId: fondoId,
      fondoNombre: fondoNombre,
      tipo: "apertura",
      monto: monto,
      fecha: new Date(),
      estado: "completada",
      notificacion: `Suscripción exitosa al fondo ${fondoNombre}. Notificación enviada por ${
        metodoNotificacion === "email" ? "Email" : "SMS"
      }`,
      metodoNotificacion: metodoNotificacion,
    };

    // Actualizar saldo del usuario
    this.authService.updateUserBalance(usuario.saldo - monto);

    // Guardar transacción
    this.transacciones.unshift(nuevaTransaccion);
    this.guardarTransacciones();

    return of(nuevaTransaccion).pipe(delay(500));
  }

  cancelarSuscripcion(
    fondoId: string,
    fondoNombre: string
  ): Observable<Transaccion> {
    const usuario = this.authService.getCurrentUser();

    if (!usuario) {
      return throwError(() => new Error("Usuario no autenticado"));
    }

    // Buscar la suscripción activa
    const suscripcionActiva = this.transacciones.find(
      (t) =>
        t.usuarioId === usuario.id &&
        t.fondoId === fondoId &&
        t.tipo === "apertura" &&
        t.estado === "completada"
    );

    if (!suscripcionActiva) {
      return throwError(
        () => new Error("No se encontró una suscripción activa para este fondo")
      );
    }

    const nuevaTransaccion: Transaccion = {
      id: Date.now().toString(),
      usuarioId: usuario.id,
      fondoId: fondoId,
      fondoNombre: fondoNombre,
      tipo: "cancelacion",
      monto: suscripcionActiva.monto,
      fecha: new Date(),
      estado: "completada",
      notificacion: `Cancelación exitosa del fondo ${fondoNombre}. Monto devuelto: $${suscripcionActiva.monto.toLocaleString(
        "es-CO"
      )}`,
    };

    // Devolver el dinero al usuario
    this.authService.updateUserBalance(usuario.saldo + suscripcionActiva.monto);

    // Guardar transacción
    this.transacciones.unshift(nuevaTransaccion);
    this.guardarTransacciones();

    return of(nuevaTransaccion).pipe(delay(500));
  }

  getTransaccionesByUsuario(usuarioId: string): Observable<Transaccion[]> {
    const transaccionesUsuario = this.transacciones.filter(
      (t) => t.usuarioId === usuarioId
    );
    return of(transaccionesUsuario).pipe(delay(200));
  }

  getFondosSuscritos(usuarioId: string): Observable<string[]> {
    const fondosSuscritos = this.transacciones
      .filter(
        (t) =>
          t.usuarioId === usuarioId &&
          t.tipo === "apertura" &&
          t.estado === "completada"
      )
      .map((t) => t.fondoId);

    // Eliminar los que han sido cancelados
    const fondosCancelados = this.transacciones
      .filter(
        (t) =>
          t.usuarioId === usuarioId &&
          t.tipo === "cancelacion" &&
          t.estado === "completada"
      )
      .map((t) => t.fondoId);

    const fondosActivos = fondosSuscritos.filter(
      (id) => !fondosCancelados.includes(id)
    );

    return of(fondosActivos).pipe(delay(200));
  }

  getMontoInvertido(usuarioId: string): Observable<number> {
    return this.getTransaccionesByUsuario(usuarioId).pipe(
      map((transacciones) => {
        let total = 0;
        transacciones.forEach((t) => {
          if (t.tipo === "apertura" && t.estado === "completada") {
            total += t.monto;
          } else if (t.tipo === "cancelacion" && t.estado === "completada") {
            total -= t.monto;
          }
        });
        return total;
      })
    );
  }

  private guardarTransacciones(): void {
    localStorage.setItem("transacciones", JSON.stringify(this.transacciones));
    this.transaccionesSubject.next(this.transacciones);
  }
}
