import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';
import { Route } from '../route/route.component';

export class Flight {
	constructor(
	  public id: number,
	  public flightNumber: string,
	  public route: Route,
	  public price: number,
	  public departureTime: Date,
	  public arrivalTime: Date,
	  public capacity: number,
	  public status: string
	) {
	}
  }

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})

export class FlightComponent implements OnInit {

	flights: Flight[];
	routes: Route[];
	closeResult: string;
	editForm: FormGroup;
	private deleteId: number;

	constructor(
		private httpClient: HttpClient,
		private modalService: NgbModal,
		private fb: FormBuilder
	){}
	
	ngOnInit(): void {
		this.getFlights();
		this.getRoutes();
		this.editForm = this.fb.group({
			id: [''],
			flightNumber: [''],
			routeId: [''],
			price: [''],
			departureTime: [''],
			arrivalTime: [''],
			capacity: ['']
		  } );
		  this.refresh();
	}

	getFlights(){
		this.httpClient.get<any>('https://saatairlines-b5afaf5b044e.herokuapp.com/api/flight/getall').subscribe(
		  response => {
			console.log(response.data);
			this.flights = response.data;
			this.setStatusAll();
		  }
		);
	}

	getRoutes(){
		this.httpClient.get<any>('https://saatairlines-b5afaf5b044e.herokuapp.com/api/route/getall').subscribe(
		  response => {
			console.log(response.data);
			this.routes = response.data;
		  }
		);
	}

	getCurrentRoutes(flight: Flight, route: Route){
		if(route.source.id == flight.id){
		  return "selected";
		}else{
		  return "";
		}
	  }

	open(content) {
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
		  return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		  return 'by clicking on a backdrop';
		} else {
		  return `with: ${reason}`;
		}
	  }

	  onSubmit(f: NgForm) {
		const url = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/flight/add';
		console.log("eklenecek veri", f.value);
		this.httpClient.post(url, f.value)
		  .subscribe((result) => {
			this.ngOnInit();
		  });
		this.modalService.dismissAll();
	  }

	  openDetails(targetModal, flight: Flight) {
		this.modalService.open(targetModal, {
		 centered: true,
		 backdrop: 'static',
		 size: 'lg'
	   });
		document.getElementById('fflightNumber').setAttribute('value', flight.flightNumber.toString());
		document.getElementById('froute').setAttribute('value', flight.route.source.name.toString()+" - "+flight.route.destination.name.toString());
		document.getElementById('fprice').setAttribute('value', flight.price.toString());
		document.getElementById('fdepartureTime').setAttribute('value', flight.departureTime.toString());
		document.getElementById('farrivalTime').setAttribute('value', flight.arrivalTime.toString());
		document.getElementById('fcapacity').setAttribute('value', flight.capacity.toString());
		document.getElementById('fstatus').setAttribute('value', flight.status.toString());
	 }

	 openEdit(targetModal, flight: Flight) {
		this.modalService.open(targetModal, {
		 centered: true,
		 backdrop: 'static',
		 size: 'lg'
	   });
	   this.editForm.patchValue( {
		id: flight.id, 
		flightNumber: flight.flightNumber,
		routeId: flight.route,
		price: flight.price,
		departureTime: flight.departureTime,
		arrivalTime: flight.arrivalTime,
		capacity: flight.capacity
	  });
	 }

	 onSave() {
		const editURL = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/flight/update?flightId=' + this.editForm.value.id;
		console.log("Gönderilen Veri",this.editForm.value);
		let flight = {
			flightNumber: this.editForm.value.flightNumber,
			routeId: this.editForm.value.routeId,
			price: this.editForm.value.price,
			departureTime: this.editForm.value.departureTime,
			arrivalTime: this.editForm.value.arrivalTime,
			capacity: this.editForm.value.capacity
		}
		console.log("Veritabanına Giden Veri", flight);
		this.httpClient.put(editURL, flight)
		  .subscribe((results) => {
			this.setStatus(this.editForm.value.id);
			this.ngOnInit();
			this.modalService.dismissAll();
		  });
	  }

	  openDelete(targetModal, flight: Flight) {
		this.deleteId = flight.id;
		this.modalService.open(targetModal, {
		  backdrop: 'static',
		  size: 'lg'
		});
	  }

	  onDelete() {
		const deleteURL = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/flight/delete/'+this.deleteId;
		this.httpClient.delete(deleteURL)
		  .subscribe((results) => {
			this.ngOnInit();
			this.modalService.dismissAll();
		  });
	  }
	  
	  setStatusAll() {
		timer(0, 60000).subscribe(() => {
			if (this.flights) {
				for (let flight of this.flights) {
				  this.setStatus(flight.id);
				}
			}
		})
	  }

	  refresh(){
		timer(0, 1000).subscribe(() => {
			const localDate = new Date();
			if(localDate.getSeconds() <= 1 && localDate.getMinutes() % 5 == 0){
				window.location.reload();
			}
		})
		
	  }
	  
	  setStatus(flightId: number) {
		const date = new Date();
		date.setHours(26);
		console.log("Tarih ", date.toISOString().slice(0, 19).replace("T", " "));
		const statusUrl = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/flight/setstatus?flightId='+ flightId.toString() +'&date=' + date.toISOString().slice(0, 19).replace("T", " ");
		this.httpClient.put(statusUrl, {})
			.subscribe();
	  }
}

