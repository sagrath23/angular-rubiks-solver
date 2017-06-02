import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { AuthService } from '../auth/auth.service';

declare var RubiksCube: Function;
declare var FlatCube: Function;
declare var RubiksCubeControls: Function;
declare var requestAnimationFrame: Function;


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
	response: any;

	@Input()
	colors: any;

	cube: any;

	flatCube: any;

	controls: any;

	movements: Array<string> = [];

	currentMovement: number = 0;

	oldWidth: number;

	constructor(private authService: AuthService, private route: ActivatedRoute, private location: Location) { }

	ngOnInit(): void {
		console.log("Mostrando respuesta");
		console.log(this.state);

		var me = this;
		var down = false;
		var parent = document.getElementById('cube').parentElement;
		var width = Math.min(parent.offsetWidth / 2 - 30, parent.offsetHeight / 5 * 3);
		if (width < 250) {
			width = window.innerWidth / 2 - 30;
		}
		if (width < 250) {
			width = window.innerWidth - 30;
			down = true;
		}
		me.oldWidth = width;
		//llamamos a la librería que dibuja el cubo y las caras
		//cubo 3D
		me.cube = new (Function.prototype.bind.apply(RubiksCube, [null, 'cube', width]));
		//cubo plano (vista de desarrollo)
		me.flatCube = new (Function.prototype.bind.apply(FlatCube, [null, 'flat-cube', width, down]));
		//controles de navegación
		me.controls = new (Function.prototype.bind.apply(RubiksCubeControls, [null, 'controls', me.cube, width]));

		//referencio las instancias del cubo plano y el cubo 3D
		me.cube.flatCube = me.flatCube;
		me.flatCube.cube = me.cube;

		//dibujo el cubo 3D;
		me.cube.tick();
		me.cube.render();
		//asigno el estado actual del cubo
		me.flatCube.setCurrentState(me.colors);

		//load response
		if(me.movements.length === 0){
			me.state = me.cube.getState();
			me.authService.solveCube(me.state)
				.then((data) => {
					me.response = data;
					me.movements = me.response.result.split(" ");
					console.log(me.movements);
					//me.controls.setSolution(me.response.result);
				});
		}
			
		//dejo la animación ejecutandose
		//así se pasan las funciones en TS
		requestAnimationFrame(() => me.run());
	}

	run(): void {
		let me = this;
		me.cube.tick();
		me.cube.render();
		// dejo la animación ejecutandose
		requestAnimationFrame(() => me.run());
	}

	goBack(): void {
		this.location.back();
	}

	showAnimation(): void {
		let me = this;
		console.log('showing response...');
		me.cube.makeMoves(me.response.result);
	}

	nextStep(): void{
		var me = this;
		
		if(me.currentMovement < me.movements.length){
			//make a movement
			me.cube.makeMove(me.movements[me.currentMovement]);
			me.currentMovement++;
		}
		else{
			console.log("disable button");
			//disable next Button
			//document.getElementById("nextStepButton").disabled = true;
		}
	}

	prevStep(): void{
		
	}
}