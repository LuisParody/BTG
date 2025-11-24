import { Injectable } from "@angular/core";
import { Observable, of, delay, throwError } from "rxjs";
import { Fondo } from "../models";

@Injectable({
  providedIn: "root",
})
export class FondosService {
  private fondos: Fondo[] = [
    {
      id: "1",
      nombre: "FPV_BTG_PACTUAL_RECAUDADORA",
      categoria: "FPV",
      montoMinimo: 75000,
      rentabilidadAnual: 8.5,
      descripcion:
        "Fondo de pensiones voluntarias con rentabilidad estable y bajo riesgo",
      riesgo: "Bajo",
      disponible: true,
    },
    {
      id: "2",
      nombre: "FPV_BTG_PACTUAL_ECOPETROL",
      categoria: "FPV",
      montoMinimo: 125000,
      rentabilidadAnual: 12.3,
      descripcion: "Fondo de inversión enfocado en el sector energético",
      riesgo: "Medio",
      disponible: true,
    },
    {
      id: "3",
      nombre: "DEUDAPRIVADA",
      categoria: "FIC",
      montoMinimo: 50000,
      rentabilidadAnual: 7.8,
      descripcion: "Fondo de inversión colectiva en deuda privada",
      riesgo: "Bajo",
      disponible: true,
    },
    {
      id: "4",
      nombre: "FDO-ACCIONES",
      categoria: "FDO",
      montoMinimo: 250000,
      rentabilidadAnual: 15.2,
      descripcion: "Fondo de acciones con alto potencial de crecimiento",
      riesgo: "Alto",
      disponible: true,
    },
    {
      id: "5",
      nombre: "FPV_BTG_PACTUAL_DINAMICA",
      categoria: "FPV",
      montoMinimo: 100000,
      rentabilidadAnual: 10.5,
      descripcion: "Fondo de pensiones con gestión dinámica de activos",
      riesgo: "Medio",
      disponible: true,
    },
  ];

  constructor() {}

  getFondos(): Observable<Fondo[]> {
    return of(this.fondos).pipe(delay(300));
  }

  getFondoById(id: string): Observable<Fondo | undefined> {
    const fondo = this.fondos.find((f) => f.id === id);
    return of(fondo).pipe(delay(200));
  }

  buscarFondos(termino: string): Observable<Fondo[]> {
    const resultados = this.fondos.filter(
      (fondo) =>
        fondo.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        fondo.descripcion.toLowerCase().includes(termino.toLowerCase())
    );
    return of(resultados).pipe(delay(300));
  }

  filtrarPorCategoria(categoria?: string): Observable<Fondo[]> {
    if (!categoria || categoria === "Todas") {
      return this.getFondos();
    }
    const filtrados = this.fondos.filter((f) => f.categoria === categoria);
    return of(filtrados).pipe(delay(300));
  }

  validarMontoMinimo(fondoId: string, monto: number): Observable<boolean> {
    const fondo = this.fondos.find((f) => f.id === fondoId);
    if (!fondo) {
      return throwError(() => new Error("Fondo no encontrado"));
    }

    if (monto < fondo.montoMinimo) {
      return throwError(
        () =>
          new Error(
            `El monto mínimo para este fondo es $${fondo.montoMinimo.toLocaleString(
              "es-CO"
            )}`
          )
      );
    }

    return of(true).pipe(delay(200));
  }
}
