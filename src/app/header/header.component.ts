import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);

  routeTo(link:string) {
    switch(link) {
      case 'home':
        this.router.navigate(['/']);
        break;
      default:
        this.router.navigate(['/' + link]);
        break;
    }
  }
}
