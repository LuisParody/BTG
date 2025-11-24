import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, delay, throwError } from "rxjs";
import { Usuario, LoginCredentials, RegisterData } from "../models";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Simulación de base de datos de usuarios
  private usuarios: Map<string, { usuario: Usuario; password: string }> =
    new Map([
      [
        "admin@btg.com",
        {
          usuario: {
            id: "1",
            nombre: "Admin",
            apellido: "BTG",
            email: "admin@btg.com",
            saldo: 50000000,
            tipoDocumento: "CC",
            numeroDocumento: "123456789",
            telefono: "3001234567",
          },
          password: "admin123",
        },
      ],
    ]);

  constructor() {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<Usuario> {
    const userRecord = this.usuarios.get(credentials.email);

    if (!userRecord || userRecord.password !== credentials.password) {
      return throwError(() => new Error("Email o contraseña incorrectos")).pipe(
        delay(500)
      );
    }

    localStorage.setItem("currentUser", JSON.stringify(userRecord.usuario));
    this.currentUserSubject.next(userRecord.usuario);

    return of(userRecord.usuario).pipe(delay(500));
  }

  register(data: RegisterData): Observable<Usuario> {
    // Verificar si el email ya existe
    if (this.usuarios.has(data.email)) {
      return throwError(() => new Error("El email ya está registrado")).pipe(
        delay(500)
      );
    }

    const nuevoUsuario: Usuario = {
      id: Date.now().toString(),
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      saldo: 500000, // Saldo inicial
      tipoDocumento: data.tipoDocumento as any,
      numeroDocumento: data.numeroDocumento,
      telefono: data.telefono,
    };

    this.usuarios.set(data.email, {
      usuario: nuevoUsuario,
      password: data.password,
    });

    localStorage.setItem("currentUser", JSON.stringify(nuevoUsuario));
    this.currentUserSubject.next(nuevoUsuario);

    return of(nuevoUsuario).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  updateUserBalance(newBalance: number): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, saldo: newBalance };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);

      // Actualizar en la "base de datos"
      const userRecord = this.usuarios.get(currentUser.email);
      if (userRecord) {
        userRecord.usuario.saldo = newBalance;
      }
    }
  }
}
