// Title: app.component.ts
// Author: Professor Krasso
// Date: 8/5/23
// Modified by: Justin Barlowe
// Modified on: 01/24/2024


// imports statements
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- This router-outlet displays the content of the BaseLayout or AuthLayout components -->
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
}
