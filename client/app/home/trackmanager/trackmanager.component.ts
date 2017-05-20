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

    currentState: string[] = new Array(20);

    state: string;

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

    /*
    combinaciones de las esquinas
    */
    private readonly edgesCombinations:any = {
      'white':{'blue': {'red':'ULF','orange':'UFR'}, 'green': {'red':'UBL','orange':'URB'}, 'red':{'blue':'ULF','green':'UBL'}, 'orange':{'blue':'UFR','green':'URB'}},
      'blue':{'white':{'red':'ULF','orange':'UFR'},'yellow':{'red':'DFL','orange':'DRF'},'red':{'white':'ULF','yellow':'DFL'},'orange':{'white':'ULF','yellow':'DFL'}},
      'orange':{'white':{'blue':'UFR','green':'URB'},'yellow':{'blue':'DRF','green':'DBR'},'green':{'white':'URB','yellow':'DBR'},'blue':{'white':'URB','yellow':'DRF'}},
      'red':{'white':{'blue':'ULF','green':'UBL'},'yellow':{'blue':'DFL','green':'DLB'},'green':{'white':'UBL','yellow':'DLB'},'blue':{'white':'ULF','yellow':'DFL'}},
      'yellow':{'blue': {'red':'DFL','orange':'DRF'}, 'orange':{'blue':'DRF','green':'DBR'},'red':{'blue':'DFL','green':'DLB'}, 'green': {'red':'DLB','orange':'DBR'}},
      'green':{'white':{'red':'UBL','orange':'URB'},'yellow':{'red':'DLB','orange':'DBR'},'red':{'white':'UBL','yellow':'DLB'},'orange':{'white':'URB','yellow':'DBR'}}
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
    //Estado objetivo UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR
    //estado actual : DB UF FR FL UR DF BL UB BR UL DL DR ULF DRF DBR DLB UFR DFL URB UBL
     */
    resolveCube(): string {
      var me = this;

      //Estado objetivo UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR
      //estado actual : DB UF FR FL UR DF BL UB BR UL DL DR ULF DRF DBR DLB UFR DFL URB UBL
      //var state = 'DB UF FR FL UR DF BL UB BR UL DL DR ULF DRF DBR DLB UFR DFL URB UBL';
      //enviamos el estado al back para que sea procesado y retorne los movimientos necesarios
      //para resolver
      //me.state = "DB UF FR FL UR DF BL UB BR UL DL DR ULF DRF DBR DLB UFR DFL URB UBL";
                  //DB UF FR FL UR DF BL UB BR UL DL DR ULF DRF DBR DLB UFR DFL URB UBL
      me.authService.solveCube(me.state)
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
        me.state = me.findUpCross() + me.findDownCross() + me.findFrontLine() + me.findBackLine() + me.findUpEdges() + me.findDownEdges();

        console.log(me.state);
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
    función que identifica qué cubies están en las posiciones UF UR UB UL
     */
    findUpCross():string{
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
          backFaceIndex = i;
        }
      }
      //ahora, procedemos a identificar las caras de los cubies que están en las posiciones
      //de la cara superior

      //saco las 4 posiciones de cruz de la cara
      var upCross = me.getCross(upFaceIndex);
      var frontCross = me.getCross(frontFaceIndex);
      var leftCross = me.getCross(leftFaceIndex);
      var rightCross = me.getCross(rightFaceIndex);
      var backCross = me.getCross(backFaceIndex);
      var result:string = "";

      //con las cruces, y conociendo el sentido en que se rotaron las caras, puedo calcular las posiciones de
      //la cruz superior
      //UF => 
      result += me.combinations[upCross[3].color][frontCross[1].color]+" ";
      //UR => 
      result += me.combinations[upCross[0].color][rightCross[2].color]+" ";
      //UB => 
      result += me.combinations[upCross[1].color][backCross[3].color]+" ";
      //UL => 
      result += me.combinations[upCross[2].color][leftCross[0].color]+" ";
      
      console.log(result);

      return result;
    }

    /*
    función que identifica qué cubies están en las posiciones DF DR DB DL
    */
    findDownCross():string{
      var me = this,
          downFaceIndex = -1,
          frontFaceIndex = -1,
          leftFaceIndex = -1,
          rightFaceIndex = -1,
          backFaceIndex = -1;

      //busco la cara de arriba
      for(var i:number = 0; i < me.faces.length; i++){
        if(me.faces[i] === 'D'){
          downFaceIndex = i;
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
          backFaceIndex = i;
        }
      }
      //ahora, procedemos a identificar las caras de los cubies que están en las posiciones
      //de la cara superior

      //saco las 4 posiciones de cruz de la cara
      var downCross = me.getCross(downFaceIndex);
      var frontCross = me.getCross(frontFaceIndex);
      var leftCross = me.getCross(leftFaceIndex);
      var rightCross = me.getCross(rightFaceIndex);
      var backCross = me.getCross(backFaceIndex);
      var result:string = "";

      //con las cruces, y conociendo el sentido en que se rotaron las caras, puedo calcular las posiciones de
      //la cruz inferior
      //DF => 
      result += me.combinations[downCross[1].color][frontCross[3].color]+" ";
      //DR => 
      result += me.combinations[downCross[0].color][rightCross[0].color]+" ";
      //DB => 
      result += me.combinations[downCross[3].color][backCross[1].color]+" ";
      //DL => down bottom & left-top
      result += me.combinations[downCross[2].color][leftCross[2].color]+" ";

      console.log(result);

      return result;
    }

    /* 
    funcion que identifica que cubies están en las posiciones FR y FL
    */
    findFrontLine():string{
      var me = this,
          frontFaceIndex = -1,
          leftFaceIndex = -1,
          rightFaceIndex = -1;

      //busco la cara del frente
      for(var i:number = 0; i < me.faces.length; i++){
        if(me.faces[i] === 'F'){
          frontFaceIndex = i;
        }
        if(me.faces[i] === 'L'){
          leftFaceIndex = i;
        }
        if(me.faces[i] === 'R'){
          rightFaceIndex = i;
        }
      }
      //ahora, procedemos a identificar las caras de los cubies que están en las posiciones
      //de la cara superior

      //saco las 4 posiciones de cruz de la cara
      var frontCross = me.getCross(frontFaceIndex);
      var leftCross = me.getCross(leftFaceIndex);
      var rightCross = me.getCross(rightFaceIndex);
      var result:string = "";

      //con las cruces, y conociendo el sentido en que se rotaron las caras, puedo calcular las posiciones de
      //la cruz superior
      //FR => up-left & front-right
      result += me.combinations[frontCross[0].color][rightCross[3].color]+" ";
      //FL => up-bottom & right-top
      result += me.combinations[frontCross[2].color][leftCross[3].color]+" ";

      console.log(result);

      return result;    
    }

    /* 
    funcion que identifica que cubies están en las posiciones BR y BL
    */
    findBackLine():string{
      var me = this,
          backFaceIndex = -1,
          leftFaceIndex = -1,
          rightFaceIndex = -1;

      //busco la cara del frente
      for(var i:number = 0; i < me.faces.length; i++){
        if(me.faces[i] === 'B'){
          backFaceIndex = i;
        }
        if(me.faces[i] === 'L'){
          leftFaceIndex = i;
        }
        if(me.faces[i] === 'R'){
          rightFaceIndex = i;
        }
      }
      //ahora, procedemos a identificar las caras de los cubies que están en las posiciones
      //de la cara superior

      //saco las 4 posiciones de cruz de la cara
      var backCross = me.getCross(backFaceIndex);
      var leftCross = me.getCross(leftFaceIndex);
      var rightCross = me.getCross(rightFaceIndex);
      var result:string = "";

      //con las cruces, y conociendo el sentido en que se rotaron las caras, puedo calcular las posiciones de
      //la cruz superior
      //BR => up-left & front-right
      result += me.combinations[backCross[0].color][rightCross[1].color]+" ";
      //BL => up-bottom & right-top
      result += me.combinations[backCross[2].color][leftCross[1].color]+" ";

      console.log(result);

      return result;    
    }

    /*
     función que identifica que cubies están en las posiciones UFR, URB, UBL, ULF
     */
    findUpEdges():string{
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
          backFaceIndex = i;
        }
      }
      //ahora, procedemos a identificar las caras de los cubies que están en las posiciones
      //de la cara superior

      //saco las 4 posiciones de las esquinas de las caras
      var upEdges = me.getEdges(upFaceIndex);
      var frontEdges = me.getEdges(frontFaceIndex);
      var leftEdges = me.getEdges(leftFaceIndex);
      var rightEdges = me.getEdges(rightFaceIndex);
      var backEdges = me.getEdges(backFaceIndex);
      var result:string = "";

      console.log(upEdges);
      console.log(frontEdges);
      console.log(leftEdges);
      console.log(rightEdges);
      console.log(backEdges);

      //blanco-azul-amarillo-verde-naranja-rojo
      //con las cruces, y conociendo el sentido en que se rotaron las caras, puedo calcular las posiciones de
      //la cruz superior
      //URF => 
      console.log(upEdges[3].color+','+rightEdges[2].color+','+frontEdges[0].color);
      result += me.edgesCombinations[upEdges[3].color][rightEdges[2].color][frontEdges[0].color]+" ";
      //URB => 
      console.log(upEdges[0].color+','+rightEdges[1].color+','+backEdges[3].color);
      result += me.edgesCombinations[upEdges[0].color][rightEdges[1].color][backEdges[3].color]+" ";
      //UBL => 
      console.log(upEdges[1].color+','+backEdges[1].color+','+leftEdges[3].color);
      result += me.edgesCombinations[upEdges[1].color][backEdges[2].color][leftEdges[0].color]+" ";
      //ULF => 
      console.log(upEdges[2].color+','+leftEdges[3].color+','+frontEdges[1].color);
      result += me.edgesCombinations[upEdges[2].color][leftEdges[3].color][frontEdges[1].color]+" ";

      console.log(result);

      return result;
    }

    /*
     función que identifica que cubies están en las posiciones DRF, DFL, DLB, DBR
     */
    findDownEdges():string{
      var me = this,
          downFaceIndex = -1,
          frontFaceIndex = -1,
          leftFaceIndex = -1,
          rightFaceIndex = -1,
          backFaceIndex = -1;

      //busco la cara de arriba
      for(var i:number = 0; i < me.faces.length; i++){
        if(me.faces[i] === 'D'){
          downFaceIndex = i;
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
          backFaceIndex = i;
        }
      }
      //ahora, procedemos a identificar las caras de los cubies que están en las posiciones
      //de la cara superior

      //saco las 4 posiciones de las esquinas de las caras
      var downEdges = me.getEdges(downFaceIndex);
      var frontEdges = me.getEdges(frontFaceIndex);
      var leftEdges = me.getEdges(leftFaceIndex);
      var rightEdges = me.getEdges(rightFaceIndex);
      var backEdges = me.getEdges(backFaceIndex);
      var result:string = "";


      //blanco-azul-amarillo-verde-naranja-rojo
      //con las cruces, y conociendo el sentido en que se rotaron las caras, puedo calcular las posiciones de
      //la cruz superior
      //DRF => 
      result += me.edgesCombinations[downEdges[0].color][rightEdges[2].color][frontEdges[3].color]+" ";
      //DFL => 
      result += me.edgesCombinations[downEdges[1].color][frontEdges[2].color][leftEdges[2].color]+" ";
      //DLB => 
      result += me.edgesCombinations[downEdges[2].color][leftEdges[1].color][backEdges[1].color]+" ";
      //DBR => 
      result += me.edgesCombinations[downEdges[3].color][backEdges[0].color][rightEdges[0].color];
      console.log(result);

      return result;
    }

    /*
    Función que verifica si la combinación que se está probando de un cubie de dos valores
    es valida
    */
    isValidCombination(faceOne:any, faceTwo:any):boolean{
      var me = this;
      //verifico que la combinación sea possible
      if(typeof me.combinations[faceOne.color][faceTwo.color] != 'undefined'){
        //es una posible combinación
        return true;
      }
      return false;
    }

    /*
    Función que retorna la cruz sobre la cara
    */
    getCross(index:number): any[]{
      var me = this;

      return [
        me.getMiddleCubie(me.cubies[index][1],false),//middle-bottom
        me.getBorderCubie(me.cubies[index][2]),//right
        me.getMiddleCubie(me.cubies[index][1],true),//middle-top
        me.getBorderCubie(me.cubies[index][0])//left
      ];
    }

    /*
    Función que retorna la línea sobre la cara que se está revisando
    */
    getEdges(index:number):any[]{
      var me = this;

      return [
        me.getEdgeCubie(me.cubies[index][2],false),//right-bottom
        me.getEdgeCubie(me.cubies[index][2],true),//right-top
        me.getEdgeCubie(me.cubies[index][0],true),//left-top
        me.getEdgeCubie(me.cubies[index][0],false)//left-bottom
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

    getEdgeCubie(cubies:any[], top:boolean): any{
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

      if(top){
        return cubies[minIndex];
      }
      else{
        return cubies[maxIndex];
      }
    }
}
