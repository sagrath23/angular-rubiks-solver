import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero/hero';

import { AuthService } from '../auth/auth.service';

import { TrackerComponent } from '../tracker/tracker.component';

@Component({
  moduleId: module.id,
  selector: 'trackmanager',
  templateUrl: 'trackmanager.component.html',
  providers: [AuthService]
})

export class TrackmanagerComponent implements OnInit {

    images: string[] = ['white','blue','red','orange','yellow','green'];
    //images: string[] = ['blue'];
    faces: string[] = new Array(6);

    cubies: any[] = new Array(6);

    baseState: string[] = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL', 'UFR', 'URB', 'UBL', 'ULF', 'DRF', 'DFL', 'DLB', 'DBR'];

    currentState: string[] = new Array(20);

    result: any;

    /*Las combinaciones son iguales para Up-down, front-back y left-right */
    private readonly combinations:any = {
      'white':{'blue':'UF','orange':'UR','red':'UL','green':'UB'},
      'blue':{'white':'UF','yellow':'DF','red':'FL','orange':'FR'},
      'orange':{'white':'UR','yellow':'DR','green':'BR','blue':'FR'},
      'red':{'white':'UL','yellow':'DL','green':'BL','blue':'FL'},
      'yellow':{'blue':'DF','orange':'DR','red':'DL','green':'DB'},
      'green':{'white':'UB','yellow':'DB','red':'BL','orange':'BR'}
    };

  	constructor(private authService: AuthService) { }

  	ngOnInit(): void {
    	console.log('loading trackers...');
  	}

    /*
    //Estado objetivo 
    UF = Blanco-azul 
    UR = Blanco-naranja 
    UB = Blanco-verde 
    UL = Blanco-rojo 
    DF = Amarillo-azul 
    DR = Amarillo-naranja
    DB = Amarillo-verde
    DL = Amarillo-rojo
    FR = Azul-naranja 
    FL = Azul-rojo 
    BR = Verde-naranja 
    BL = Verde-rojo 
    UFR = Blanco-azul-naranja 
    URB = Blanco-naranja-verde
    UBL = Blanco-verde-rojo 
    ULF = Blanco-rojo-azul
    DRF = Amarillo-naranja-azul
    DFL = Amarillo-azul-rojo
    DLB = Amarillo-rojo-verde
    DBR = Amarillo-verde-naranja
     */
    resolveCube(): string {
      var me = this;

      //Estado objetivo UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR
      //estado actual : DB UF FR FL UR DF BL UB RB UR DL DR UFL FDR RDB RDB FRU DFL URB UBL

      var state = 'BR DF UR LB BD FU FL DL RD FR LU BU UBL FDR FRU BUR ULF LDF RDB DLB';
      //enviamos el estado al back para que sea procesado y retorne los movimientos necesarios
      //para resolver
      me.authService.solveCube(state)
            .then((data) => {
              me.result = data;
            });

      return me.result;
    }

    /*
    función que se ejecuta cuando se detecta la cara que se enceuntra en la imágen
    */
    setFaceId(event: any):void{
      var me = this;

      me.faces[me.images.indexOf(event.imageName)] = event.faceId;
      me.cubies[me.images.indexOf(event.imageName)] = event.cubies;

      if(me.check()){
        me.findUpCross();
      }
    }

    /*
    función que verifica que se hayan identificado todas las caras del cubo en las imágenes
    */
    check():boolean{
      var me = this;
      for(var i = 0; i < me.faces.length; i++){
        if(typeof me.faces[i] === 'undefined'){
          return false;
        }
      }
       return true;
    }

    /*
    función que identifica qué cubies están en las posiciones UF,UR,UL,UB

    Alternativas 
    Azul:     Azul-blanco
              Azul-amarillo
              Azul-naranja
              Azul-rojo
    Blanco:   Blanco-rojo
              Blanco-naranja
              Blanco-verde
    Amarillo: Amarillo-rojo
              Amarillo-naranja
              Amarillo-verde
    Verde:    Verde-rojo
              Verde-naranja               

     */
    findUpCross():void{
      var me = this,
          upFaceIndex = -1,
          frontFaceIndex = -1,
          leftFaceIndex = -1,
          rightFaceIndex = -1,
          backFaceIndex = -1;

      //busco la cara de arriba
      for(var i:number = 0; i < me.faces.length; i++){
        if(me.faces[i] === 'U'){
          upFaceIndex = i;
        }
        if(me.faces[i] === 'F'){
          frontFaceIndex = i;
        }
        if(me.faces[i] === 'L'){
          leftFaceIndex = i;
        }
        if(me.faces[i] === 'R'){
          rightFaceIndex = i;
        }
        if(me.faces[i] === 'B'){
          leftFaceIndex = i;
        }
      }
      //ahora, procedemos a identificar las caras de los cubies que están en las posiciones
      //de la cara superior

      //saco las 4 posiciones de cruz de la cara
      var upCross = me.getCross(upFaceIndex);
      var frontCross = me.getCross(frontFaceIndex);
      var leftCross = me.getCross(leftFaceIndex);
      var rightCross = me.getCross(rightFaceIndex);
      var upCrossChances = [Array(),Array(),Array(),Array()];
      //empezamos a comparar las posiciones de ambas cruces para hallar combinaciones 
      //validas
      console.log(upCross,"cruz de arriba");
      console.log(frontCross,"cruz del frente");

      for(var i = 0;i < upCross.length; i++){
        //empezamos a mirar las combinaciones
        for(var j = 0; j < frontCross.length; j++){
          if(me.isValidCombination(upCross[i],frontCross[j])){
            //guardo el posible cubo resultante
            upCrossChances[i].push(me.combinations[upCross[i].color][frontCross[j].color]);
          }
        }
      }

      console.log(upCrossChances,'Options...');
    }

    isValidCombination(faceOne:any, faceTwo:any):boolean{
      var me = this;
      //verifico que la combinación sea possible
      if(typeof me.combinations[faceOne.color][faceTwo.color] != 'undefined'){
        //es una posible combinación
        return true;
      }
      return false;
    }

    getCross(index:number): any[]{
      var me = this;

      return [
        me.getMiddleCubie(me.cubies[index][1],false),//middle-bottom
        me.getBorderCubie(me.cubies[index][2]),//right
        me.getMiddleCubie(me.cubies[index][1],true),//middle-top
        me.getBorderCubie(me.cubies[index][0]),//left
      ];
    }

    /*
    Retorna el cubie superior o inferior de la fila del medio  dependiendo del valor de 
    getUpCubie
    */
    getMiddleCubie(cubies:any[],getUpCubie:boolean): any{
      var me = this;

      if(getUpCubie){
        //obtenemos el cubo del medio que esta más arriba
        var index:number = -1,
            minY:number = Number.MAX_VALUE;

        for(var i = 0; i < cubies.length; i++){
          if(cubies[i].y < minY){
            index= i;
            minY = cubies[i].y;
          }
        }
        return cubies[index];
      }
      else{
        //obtenemos el cubo que está al medio en la parte inferior
        var index:number = -1,
            maxY:number = Number.MIN_VALUE;

        for(var i = 0; i < cubies.length; i++){
          if(cubies[i].y > maxY){
            index= i;
            maxY = cubies[i].y;
          }
        }
        return cubies[index];
      }
    }

    /*
    retorna el cubie del medio de la fila
    */
    getBorderCubie(cubies:any[]): any{
      var me = this,
        minY = Number.MAX_VALUE,
        maxY = Number.MIN_VALUE,
        minIndex = -1,
        maxIndex = -1,
        centerIndex = -1;

      //extraemos los míninos y máximos de los cubies del medio
      for(var i = 0; i < cubies.length; i++){
        if(cubies[i].y < minY){
          minIndex = i;
          minY = cubies[i].y;
        }
        if(cubies[i].y > maxY){
          maxIndex = i;
          maxY = cubies[i].y;
        }
      }

      //con estos valores identificados, se determina el cubie del medio
      for(var i = 0; i < cubies.length; i++){
        if(i != minIndex && i != maxIndex){
          centerIndex = i;
          break;
        }
      }

      return cubies[centerIndex];
    }
}
