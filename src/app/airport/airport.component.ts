import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';


export class Airport {
	constructor(
	  public id: number,
	  public name: string,
	  public code: string,
	  public city: string,
	  public country: string
	) {
	}
  }

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.css']
})
export class AirportComponent implements OnInit {

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
		this.getAirports();
		this.editForm = this.fb.group({
			id: [''],
			name: [''],
			code: [''],
			city: [''],
			country: ['']
		  } );
	}

	getAirports(){
		this.httpClient.get<any>('https://saatairlines-b5afaf5b044e.herokuapp.com/api/airport/getall').subscribe(
		  response => {
			console.log(response);
			this.airports = response.data;
		  }
		);
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
		const url = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/airport/add';
		this.httpClient.post(url, f.value)
		  .subscribe((result) => {
			this.ngOnInit();
		  });
		this.modalService.dismissAll();
	  }

	  openDetails(targetModal, airport: Airport) {
		this.modalService.open(targetModal, {
		 centered: true,
		 backdrop: 'static',
		 size: 'lg'
	   });
		document.getElementById('fname').setAttribute('value', airport.name);
		document.getElementById('fcode').setAttribute('value', airport.code);
		document.getElementById('fcity').setAttribute('value', airport.city);
		document.getElementById('fcountry').setAttribute('value', airport.country);
	 }

	 openEdit(targetModal, airport: Airport) {
		this.modalService.open(targetModal, {
		 centered: true,
		 backdrop: 'static',
		 size: 'lg'
	   });
	   this.editForm.patchValue( {
		id: airport.id, 
		name: airport.name,
		code: airport.code,
		city: airport.city,
		country: airport.country
	  });
	 }

	 onSave() {
		const editURL = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/airport/update';
		console.log(this.editForm.value);
		this.httpClient.put(editURL, this.editForm.value)
		  .subscribe((results) => {
			this.ngOnInit();
			this.modalService.dismissAll();
		  });
	  }

	  openDelete(targetModal, airport: Airport) {
		this.deleteId = airport.id;
		this.modalService.open(targetModal, {
		  backdrop: 'static',
		  size: 'lg'
		});
	  }

	  onDelete() {
		const deleteURL = 'https://saatairlines-b5afaf5b044e.herokuapp.com/api/airport/delete/'+this.deleteId;
		this.httpClient.delete(deleteURL)
		  .subscribe((results) => {
			this.ngOnInit();
			this.modalService.dismissAll();
		  });
	  }

}

