# 📊 BTG - Sistema de Gestión de Fondos

## 📝 Descripción del Proyecto

Aplicación web desarrollada en **Angular 18** para la gestión de fondos de inversión de BTG. Permite a los usuarios registrarse, consultar fondos disponibles, suscribirse a fondos, cancelar suscripciones y visualizar el historial de transacciones.

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
BTG/
├── src/
│   ├── app/
│   │   ├── components/         # Componentes de la aplicación
│   │   │   ├── login/         # Componente de inicio de sesión
│   │   │   ├── register/      # Componente de registro
│   │   │   ├── dashboard/     # Panel principal del usuario
│   │   │   ├── fondos/        # Lista y gestión de fondos
│   │   │   ├── historial/     # Historial de transacciones
│   │   │   └── navbar/        # Barra de navegación
│   │   ├── services/          # Servicios de la aplicación
│   │   │   ├── auth.service.ts           # Gestión de autenticación
│   │   │   ├── fondos.service.ts         # Gestión de fondos
│   │   │   └── transacciones.service.ts  # Gestión de transacciones
│   │   ├── guards/            # Protección de rutas
│   │   │   └── auth.guard.ts  # Guard de autenticación
│   │   ├── models/            # Modelos de datos TypeScript
│   │   │   └── index.ts       # Interfaces y tipos
│   │   ├── app.component.ts   # Componente raíz
│   │   ├── app.config.ts      # Configuración de la aplicación
│   │   └── app.routes.ts      # Configuración de rutas
│   ├── index.html             # HTML principal
│   ├── main.ts                # Punto de entrada de la aplicación
│   └── styles.css             # Estilos globales
├── angular.json               # Configuración de Angular CLI
├── tsconfig.json              # Configuración de TypeScript
└── package.json               # Dependencias del proyecto
```

---

## 🎯 Características Principales

### 1. **Autenticación y Registro**
- Sistema de login con validación de credenciales
- Registro de nuevos usuarios con validación de formularios
- Persistencia de sesión usando `localStorage`
- Guards para proteger rutas privadas
- Usuario: admin@btg.com
- Contraseña: admin123

### 2. **Dashboard**
- Visualización del saldo disponible
- Monto total invertido
- Patrimonio total
- Últimas 5 transacciones
- Accesos rápidos a fondos e historial

### 3. **Gestión de Fondos**
- Listado de fondos disponibles
- Filtrado por categoría (FPV, FIC, FDO)
- Búsqueda por nombre
- Información detallada de cada fondo:
  - Monto mínimo de inversión
  - Rentabilidad anual
  - Nivel de riesgo
- Suscripción a fondos
- Cancelación de suscripciones
- Validación de saldo y montos mínimos

### 4. **Historial de Transacciones**
- Lista completa de todas las transacciones
- Filtrado por tipo (suscripciones/cancelaciones)
- Estadísticas de operaciones
- Fechas y montos detallados

---

## 🔧 Tecnologías Utilizadas

### Frontend
- **Angular 18** - Framework principal
- **TypeScript 5.4** - Lenguaje de programación
- **Standalone Components** - Arquitectura moderna de Angular
- **Reactive Forms** - Validación de formularios
- **RxJS** - Programación reactiva
- **CSS3** - Estilos y diseño responsive

### Características de Angular 18
- ✅ Standalone Components (sin módulos NgModule)
- ✅ Signals (nueva API reactiva)
- ✅ Functional Guards
- ✅ Bootstrap de aplicación moderno
- ✅ Configuración basada en funciones

---

## 📦 Modelos de Datos

### Usuario
```typescript
interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  saldo: number;
  tipoDocumento: 'CC' | 'CE' | 'TI' | 'Pasaporte';
  numeroDocumento: string;
  telefono: string;
}
```

### Fondo
```typescript
interface Fondo {
  id: string;
  nombre: string;
  categoria: 'FPV' | 'FIC' | 'FDO';
  montoMinimo: number;
  rentabilidadAnual: number;
  descripcion: string;
  riesgo: 'Bajo' | 'Medio' | 'Alto';
  disponible: boolean;
}
```

### Transacción
```typescript
interface Transaccion {
  id: string;
  usuarioId: string;
  fondoId: string;
  fondoNombre: string;
  tipo: 'apertura' | 'cancelacion';
  monto: number;
  fecha: Date;
  estado: 'pendiente' | 'completada' | 'cancelada';
  notificacion?: string;
}
```

---

## 🔐 Servicios

### 1. AuthService (`auth.service.ts`)

**Responsabilidad:** Gestión de autenticación y sesión de usuarios

**Métodos principales:**
- `login(credentials)` - Inicia sesión
- `register(data)` - Registra nuevo usuario
- `logout()` - Cierra sesión
- `isAuthenticated()` - Verifica si hay sesión activa
- `getCurrentUser()` - Obtiene usuario actual
- `updateUserBalance(newBalance)` - Actualiza saldo del usuario

**Características:**
- Usa `BehaviorSubject` para estado reactivo del usuario
- Almacena datos en `localStorage`
- Simula base de datos con `Map`
- Observable del usuario actual para suscripciones

**Ejemplo de uso:**
```typescript
this.authService.login({ email: 'admin@btg.com', password: 'admin123' })
  .subscribe({
    next: (user) => console.log('Login exitoso', user),
    error: (error) => console.error('Error', error)
  });
```

---

### 2. FondosService (`fondos.service.ts`)

**Responsabilidad:** Gestión de fondos de inversión

**Métodos principales:**
- `getFondos()` - Obtiene todos los fondos
- `getFondoById(id)` - Obtiene un fondo específico
- `buscarFondos(termino)` - Búsqueda de fondos
- `filtrarPorCategoria(categoria)` - Filtra por categoría
- `validarMontoMinimo(fondoId, monto)` - Valida monto mínimo

**Características:**
- Datos simulados de 5 fondos diferentes
- Observables con delay para simular llamadas API
- Validaciones de negocio

**Fondos disponibles:**
1. **FPV_BTG_PACTUAL_RECAUDADORA** - Bajo riesgo, 8.5% anual
2. **FPV_BTG_PACTUAL_ECOPETROL** - Medio riesgo, 12.3% anual
3. **DEUDAPRIVADA** - Bajo riesgo, 7.8% anual
4. **FDO-ACCIONES** - Alto riesgo, 15.2% anual
5. **FPV_BTG_PACTUAL_DINAMICA** - Medio riesgo, 10.5% anual

---

### 3. TransaccionesService (`transacciones.service.ts`)

**Responsabilidad:** Gestión de transacciones (suscripciones/cancelaciones)

**Métodos principales:**
- `suscribirFondo(fondoId, fondoNombre, monto)` - Suscribe a un fondo
- `cancelarSuscripcion(fondoId, fondoNombre)` - Cancela suscripción
- `getTransaccionesByUsuario(usuarioId)` - Obtiene transacciones del usuario
- `getFondosSuscritos(usuarioId)` - Fondos activos del usuario
- `getMontoInvertido(usuarioId)` - Calcula monto total invertido

**Características:**
- Persiste transacciones en `localStorage`
- Usa `BehaviorSubject` para actualizaciones reactivas
- Actualiza automáticamente el saldo del usuario
- Valida saldo suficiente antes de suscribir
- Devuelve dinero al cancelar suscripción

**Flujo de suscripción:**
1. Valida usuario autenticado
2. Verifica saldo suficiente
3. Crea transacción de tipo "apertura"
4. Descuenta del saldo del usuario
5. Guarda en localStorage
6. Emite notificación de éxito

---

## 🛡️ Guards

### authGuard (`auth.guard.ts`)

**Funcional Guard de Angular 18**

**Propósito:** Protege rutas que requieren autenticación

```typescript
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

### loginGuard

**Propósito:** Evita acceso a login/register si ya está autenticado

```typescript
export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
```

---

## 🧩 Componentes

### 1. LoginComponent

**Ruta:** `/login`

**Funcionalidad:**
- Formulario reactivo con validaciones
- Validación de email y contraseña
- Mensajes de error personalizados
- Redirección automática al dashboard tras login exitoso
- Link a registro
- Credenciales demo visibles

**Validaciones:**
- Email requerido y formato válido
- Contraseña mínimo 6 caracteres

---

### 2. RegisterComponent

**Ruta:** `/register`

**Funcionalidad:**
- Registro de nuevos usuarios
- Formulario con múltiples campos validados
- Saldo inicial de $500,000 COP
- Tipos de documento: CC, CE, TI, Pasaporte

**Validaciones:**
- Nombre y apellido mínimo 2 caracteres
- Email único y válido
- Contraseña mínimo 6 caracteres
- Número de documento solo números
- Teléfono exactamente 10 dígitos

---

### 3. DashboardComponent

**Ruta:** `/dashboard`

**Funcionalidad:**
- Resumen financiero del usuario:
  - Saldo disponible
  - Monto invertido
  - Patrimonio total
- Últimas 5 transacciones
- Botones de acceso rápido
- Actualizaciones reactivas en tiempo real

**Características especiales:**
- Icons visuales para cada métrica
- Cards con animaciones hover
- Responsive design

---

### 4. FondosComponent

**Ruta:** `/fondos`

**Funcionalidad:**
- Lista todos los fondos disponibles
- Filtrado por categoría (FPV/FIC/FDO)
- Búsqueda por nombre/descripción
- Modal de suscripción
- Validación de monto mínimo
- Indicador de fondos ya suscritos
- Cancelación de suscripciones

**Modal de suscripción:**
- Información detallada del fondo
- Input de monto a invertir
- Validación de monto mínimo
- Validación de saldo disponible
- Confirmación visual de éxito

---

### 5. HistorialComponent

**Ruta:** `/historial`

**Funcionalidad:**
- Lista completa de transacciones
- Filtros por tipo (todas/suscripciones/cancelaciones)
- Estadísticas generales:
  - Total de suscripciones
  - Total de cancelaciones
  - Monto invertido actual
- Tabla responsive con información detallada

**Datos mostrados:**
- Fecha y hora de transacción
- Nombre del fondo
- Tipo de operación
- Monto (con signo + o -)
- Estado de la transacción

---

### 6. NavbarComponent

**Funcionalidad:**
- Navegación principal de la aplicación
- Menú responsive para móviles
- Indicador de usuario actual
- Botón de cierre de sesión
- Links activos destacados

**Links de navegación:**
- 🏠 Inicio (Dashboard)
- 📊 Fondos
- 📜 Historial

---

## 🎨 Estilos y Diseño

### Sistema de Colores

```css
--primary-color: #003d82;      /* Azul BTG */
--secondary-color: #0066cc;    /* Azul claro */
--accent-color: #ffa500;       /* Naranja */
--success-color: #28a745;      /* Verde */
--danger-color: #dc3545;       /* Rojo */
--warning-color: #ffc107;      /* Amarillo */
```

### Características de Diseño

- ✅ **Diseño Responsive** - Funciona en móviles, tablets y desktop
- ✅ **Grid System** - Layout flexible con CSS Grid
- ✅ **Cards** - Contenedores visuales consistentes
- ✅ **Animaciones** - Transiciones suaves en hover
- ✅ **Formularios estilizados** - Inputs y botones profesionales
- ✅ **Alertas y badges** - Feedback visual claro
- ✅ **Modal personalizado** - Sin dependencias externas

### Responsive Breakpoints

- **Mobile:** < 768px - Layout de una columna
- **Tablet:** 768px - 1024px - Layout adaptativo
- **Desktop:** > 1024px - Layout completo

---

## 🚀 Configuración de Rutas

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'fondos', component: FondosComponent, canActivate: [authGuard] },
  { path: 'historial', component: HistorialComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
```

**Protecciones:**
- Rutas públicas: `/login`, `/register`
- Rutas privadas: `/dashboard`, `/fondos`, `/historial`
- Redirección automática según estado de autenticación

---

## 📱 Características de Angular 18

### Standalone Components

Todos los componentes son **standalone**, sin necesidad de NgModules:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
```

**Ventajas:**
- ✅ Código más simple y directo
- ✅ Mejor tree-shaking
- ✅ Carga más rápida
- ✅ Imports explícitos por componente

### Functional Guards

Guards implementados como funciones puras:

```typescript
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
```

### Reactive Programming

Uso extensivo de **RxJS Observables**:

```typescript
// BehaviorSubject para estado reactivo
private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();

// Suscripción en componentes
this.authService.currentUser$.subscribe(user => {
  this.usuario = user;
});
```

---

## 💾 Persistencia de Datos

### LocalStorage

**Datos almacenados:**
- `currentUser` - Usuario autenticado
- `transacciones` - Historial de transacciones

**Ventajas:**
- No requiere backend
- Datos persisten al cerrar el navegador
- Fácil de implementar

**Limitaciones:**
- Datos solo en el navegador local
- No compartidos entre dispositivos
- Capacidad limitada (~5-10 MB)

---

## 🔄 Flujos de Usuario

### Flujo de Login

1. Usuario ingresa email y contraseña
2. Sistema valida credenciales
3. Si es válido: guarda usuario en localStorage
4. Actualiza BehaviorSubject
5. Redirige a /dashboard
6. Si es inválido: muestra error

### Flujo de Suscripción a Fondo

1. Usuario navega a /fondos
2. Explora fondos disponibles
3. Hace clic en "Suscribirse"
4. Se abre modal con detalles
5. Ingresa monto a invertir
6. Sistema valida:
   - Monto >= monto mínimo
   - Saldo >= monto a invertir
7. Seleccionar método de Notificación  
8. Si válido:
   - Crea transacción
   - Descuenta saldo
   - Guarda en localStorage
   - Muestra notificación
   - Redirige a dashboard
9. Si inválido: muestra error

### Flujo de Cancelación

1. Usuario ve fondo suscrito
2. Hace clic en "Cancelar Suscripción"
3. Confirma en diálogo
4. Sistema:
   - Busca transacción original
   - Crea transacción de cancelación
   - Devuelve monto al saldo
   - Actualiza localStorage
5. Muestra notificación de éxito

---

## 🧪 Datos de Prueba

### Usuario Demo

```
Email: admin@btg.com
Contraseña: admin123
Saldo inicial: $50,000,000 COP
```

### Crear Nuevo Usuario

1. Ir a `/register`
2. Llenar formulario
3. Saldo inicial automático: $500,000 COP

---

## 📋 Instalación y Ejecución

### Requisitos Previos

- Node.js 18+ 
- npm 9+

### Instalación

```bash
# Navegar al directorio del proyecto
cd parody

# Instalar dependencias
npm install

# Instalar Angular CLI globalmente (si no lo tienes)
npm install -g @angular/cli
```

### Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start
# o
ng serve

# La aplicación estará disponible en:
# http://localhost:4200
```

### Build de Producción

```bash
# Generar build optimizado
npm run build
# o
ng build --configuration production

# Los archivos se generarán en: dist/btg-fondos-app
```

---

## 🔍 Validaciones Implementadas

### Formularios

**Login:**
- Email requerido y formato válido
- Contraseña requerida (mínimo 6 caracteres)

**Registro:**
- Nombre y apellido requeridos (mínimo 2 caracteres)
- Email único y válido
- Contraseña mínimo 6 caracteres
- Número de documento solo números
- Teléfono exactamente 10 dígitos

**Suscripción:**
- Monto >= monto mínimo del fondo
- Monto <= saldo disponible del usuario

### Lógica de Negocio

- No permitir suscripción duplicada al mismo fondo
- Verificar saldo antes de suscribir
- Solo permitir cancelar fondos suscritos activos
- Actualizar saldo automáticamente tras transacciones

---

## 🎯 Mejores Prácticas Implementadas

### Angular

✅ **Standalone Components** - Arquitectura moderna  
✅ **Reactive Forms** - Validación robusta  
✅ **Services con Injectable** - Inyección de dependencias  
✅ **Guards funcionales** - Protección de rutas  
✅ **Observables y RxJS** - Programación reactiva  
✅ **OnPush Change Detection** - Optimización (opcional)  
✅ **TypeScript strict mode** - Type safety  

### Código

✅ **Separación de responsabilidades** - Services vs Components  
✅ **Interfaces tipadas** - Type safety completo  
✅ **Código reutilizable** - DRY principle  
✅ **Nombres descriptivos** - Clean code  
✅ **Comentarios mínimos** - Código autoexplicativo  

### UX/UI

✅ **Feedback visual** - Loading, errors, success  
✅ **Responsive design** - Funciona en todos los dispositivos  
✅ **Validación en tiempo real** - Formularios reactivos  
✅ **Navegación intuitiva** - UX clara  
✅ **Mensajes de error claros** - Ayuda al usuario  

---

## 🚧 Posibles Mejoras Futuras

### Funcionalidades

- [ ] Backend real con API REST
- [ ] Base de datos (MongoDB, PostgreSQL)
- [ ] Autenticación con JWT
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Notificaciones push
- [ ] Gráficos de rentabilidad
- [ ] Exportar transacciones a PDF/Excel
- [ ] Múltiples cuentas bancarias
- [ ] Chat de soporte

### Técnicas

- [ ] Tests unitarios (Jasmine/Jest)
- [ ] Tests E2E (Cypress)
- [ ] PWA (Progressive Web App)
- [ ] Server-Side Rendering (SSR)
- [ ] Estado global con NgRx
- [ ] Internacionalización (i18n)
- [ ] Lazy loading de módulos
- [ ] Optimización de performance

---

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

---

## 👨‍💻 Autor

Desarrollado con Angular 18 como prueba técnica para BTG.

---

## 🆘 Soporte

Para reportar problemas o sugerencias, crear un issue en el repositorio.

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Angular 18 Documentation](https://angular.dev/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

### Tutoriales Útiles

- [Angular University](https://angular-university.io/)
- [Angular.io Tutorial](https://angular.io/tutorial)

---

**¡Gracias por revisar este proyecto! 🚀**
