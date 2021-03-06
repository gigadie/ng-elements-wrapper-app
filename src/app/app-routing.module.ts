import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/error/error.component';
import { EmptyComponent } from './components/empty/empty.component';
import { HostedAppComponent } from './components/hosted-app/hosted-app.component';

const routes: Routes = [
	// Eager routes
	{ path: 'settings', component: SettingsComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'error', component: ErrorComponent },
	// Apps routes
	{ path: ':appRoute/:appSpecific', redirectTo: ':appRoute', pathMatch: 'full' },
	{ path: ':appRoute', component: HostedAppComponent },
	// Wildcard route
	{ path: '**', component: EmptyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
