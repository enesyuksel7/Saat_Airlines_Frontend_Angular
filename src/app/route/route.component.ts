import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Airport } from '../airport/airport.component';

export class Route {
	constructor(
	  public id: number,
	  public source: Airport,
	  public destination: Airport,
	  public distanceinmiles: number
	) {
	}
  }

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

	routes: Route[];
	airports: Airport[];
	closeResult: string;
	editForm: FormGroup;
	private deleteId: number;

	constructor(
		private httpClient: HttpClient,
		private modalService: NgbModal,
		private fb: FormBuilder
	){}
	
	ngOnInit(): void {
		this.getRoutes();
		this.getAirports();
		this.editForm = this.fb.group({
			id: [''],
			sourceId: [''],
			destinationId: [''],
			distanceinmiles: ['']
		  } );
	}

	getRoutes(){
		this.httpClient.get<any>('https://saatairlines-b5afaf5b044e.herokuapp.com/api/route/getall').subscribe(
		  response => {
			console.log(response.data);
			this.routes = response.data;
		  }
		);
	}

	getAirports(){
		this.httpClient.get<any>('https://saatairlines-b5afaf5b044e.herokuapp.com/api/airport/getall').subscribe(
		  response => {
			console.log(response.data);
			this.airports = response.data;
		  }
		);
	}

	getCurrentAirport(route: Route, airport: Airport){
		if(route.source.id == airport.id){
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
		const url = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/route/add';
		console.log(f.value);
		this.httpClient.post(url, f.value)
		  .subscribe((result) => {
			this.ngOnInit();
		  });
		this.modalService.dismissAll();
	  }

	  openDetails(targetModal, route: Route) {
		this.modalService.open(targetModal, {
		 centered: true,
		 backdrop: 'static',
		 size: 'lg'
	   });
		document.getElementById('fsourceId').setAttribute('value', route.source.name.toString());
		document.getElementById('fdestinationId').setAttribute('value', route.destination.name.toString());
		document.getElementById('fdistanceinmiles').setAttribute('value', route.distanceinmiles.toString());
	 }

	 openEdit(targetModal, route: Route) {
		this.modalService.open(targetModal, {
		 centered: true,
		 backdrop: 'static',
		 size: 'lg'
	   });
	   this.editForm.patchValue( {
		id: route.id, 
		sourceId: route.source,
		destinationId: route.destination,
		distanceinmiles: route.distanceinmiles
	  });
	 }

	 onSave() {
		const editURL = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/route/update?routeId=' + this.editForm.value.id;
		console.log("Gönderilen Veri",this.editForm.value);
		let route = {
			sourceId: this.editForm.value.sourceId,
			destinationId: this.editForm.value.destinationId,
			distanceInMiles: this.editForm.value.distanceinmiles
		}
		console.log("Veritabanına Giden Veri", route);
		this.httpClient.put(editURL, route)
		  .subscribe((results) => {
			this.ngOnInit();
			this.modalService.dismissAll();
		  });
	  }

	  openDelete(targetModal, route: Route) {
		this.deleteId = route.id;
		this.modalService.open(targetModal, {
		  backdrop: 'static',
		  size: 'lg'
		});
	  }

	  onDelete() {
		const deleteURL = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/route/delete/'+this.deleteId;
		this.httpClient.delete(deleteURL)
		  .subscribe((results) => {
			this.ngOnInit();
			this.modalService.dismissAll();
		  });
	  }

}

