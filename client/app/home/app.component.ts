import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <md-toolbar color="primary">
    <md-toolbar-row>
      <span>{{title}}</span>
      <span class="example-spacer"></span>
      <md-icon class="example-icon">verified_user</md-icon>
    </md-toolbar-row>
  </md-toolbar>  
  <router-outlet></router-outlet>`
})

export class AppComponent {

	title = "Angular rubik's solver";

}
