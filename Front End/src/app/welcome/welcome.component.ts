import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {

  isLogging : boolean = false;
  constructor(private translate: TranslateService){
    translate.addLangs(["en", "ar"]);
  }

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.isLogging = true
    }
  }
}
