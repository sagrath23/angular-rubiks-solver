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
    
    result: any;

  	constructor(private authService: AuthService) { }

  	ngOnInit(): void {
    	console.log('loaging trackers...');
  	}
    
    resolveCube(): string {
      var me = this;
  
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
}
