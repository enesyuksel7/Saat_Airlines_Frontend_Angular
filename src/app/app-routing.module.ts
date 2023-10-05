import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirportComponent } from './airport/airport.component';
import { FlightComponent } from './flight/flight.component';
import { HomeComponent } from './home/home.component';
import { RouteComponent } from './route/route.component';

const routes: Routes = [
	{path: 'home', component: HomeComponent},
	{path: 'airports', component: AirportComponent},
	{path: 'routes', component: RouteComponent},
	{path: 'flights', component: FlightComponent},
	{path: '', component: HomeComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
