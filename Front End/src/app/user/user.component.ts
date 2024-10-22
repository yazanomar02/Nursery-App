import { Component } from '@angular/core';
import { RegistrationComponent } from './registration/registration.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RegistrationComponent , RouterOutlet],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  animations:[
    
  ]
})
export class UserComponent {

}
