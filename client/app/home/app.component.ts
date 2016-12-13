import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<h1>{{title}}</h1>
			<login-component></login-component>`			 
})

export class AppComponent { 

	title = 'Hero Editor';

}
