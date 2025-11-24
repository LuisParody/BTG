import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { FondosComponent } from "./components/fondos/fondos.component";
import { HistorialComponent } from "./components/historial/historial.component";
import { authGuard, loginGuard } from "./guards/auth.guard";

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [loginGuard] },
  { path: "register", component: RegisterComponent, canActivate: [loginGuard] },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: "fondos", component: FondosComponent, canActivate: [authGuard] },
  {
    path: "historial",
    component: HistorialComponent,
    canActivate: [authGuard],
  },
  { path: "**", redirectTo: "/login" },
];
