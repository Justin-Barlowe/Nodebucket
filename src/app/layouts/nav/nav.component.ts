//Title: nav.component.ts
//Author: Professor Krasso
//Date: 8/5/23
//Modified by: Justin Barlowe
//Date: 01/18/2024

// imports statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export interface AppUser {
  fullName: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  appUser: AppUser;
  isLoggedIn: boolean;

  constructor(private cookieService: CookieService,) {
    this.appUser = {} as AppUser;
    this.isLoggedIn = this.cookieService.get('session_user') ? true : false;

    if (this.isLoggedIn) {
      this.appUser = {
        fullName: this.cookieService.get('session_name')
      }
      console.log(this.appUser.fullName)
    }
  }

  signout() {
    console.log('signout');
    this.cookieService.deleteAll();
    window.location.href = '/';
  }

}
