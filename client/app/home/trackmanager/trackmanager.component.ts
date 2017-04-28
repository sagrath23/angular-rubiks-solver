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

    result: any;

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
              console.log(me.result);
            });

      return me.result;
    }

    setFaceId(event: any):void{
      var me = this;
      me.faces[me.images.indexOf(event.imageName)] = event.faceId;
      me.cubies[me.images.indexOf(event.imageName)] = event.cubies;

      if(me.check()){
        me.findUpCross();
      }
    }

    check():boolean{
      var me = this;
      for(var i = 0; i < me.faces.length; i++){
        if(me.faces[i] === null){
          return false;
        }
      }
       return true;
    }

    /*
    función que identifica qué cubies están en las posiciones UF,UR,UL,UB
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
      


    }
}
