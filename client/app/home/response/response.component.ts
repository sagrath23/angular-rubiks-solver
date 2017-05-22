import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { AuthService } from '../auth/auth.service';
import { Hero } from '../hero/hero';

@Component({
  moduleId: module.id,
  selector: 'response-component',
  templateUrl: 'response.component.html',
  providers: [AuthService]
})

export class ResponseComponent implements OnInit {

	@Input()
	state: string;

	@Input()
	response: string;

	constructor(private authService: AuthService, 
		private route: ActivatedRoute, 
		private location: Location) {}

	ngOnInit(): void {
		console.log("Mostrando respuesta");
		console.log(this.state);
	}

	goBack(): void {
  		this.location.back();
	}
}