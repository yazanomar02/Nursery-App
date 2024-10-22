import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , RouterLink, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
     private formBuilder : FormBuilder,
     protected service : AuthService,
     private router : Router,
     private translate: TranslateService
     //private toaster : Toaster
    ) {
      translate.addLangs(["en", "ar"]);
      translate.setDefaultLang("en");
    }
  
  addForm!: FormGroup;
  isSubmitted : boolean = false;

  ngOnInit(): void {

    this.addForm = this.formBuilder.group({
      email : ['',Validators.required ],
      password : ['',Validators.required ],
    })
  }
  onSubmit(){
    this.isSubmitted = true
    if(this.addForm.valid){
      this.service.signin(this.addForm.value).subscribe({
        next:(res:any)=>{
          localStorage.setItem('token' , res.token);
          localStorage.setItem('userRole' , res.userRole);

          if(res.userRole === 'company'){
            localStorage.setItem('companyId' , res.manageId);
          }

          else if(res.userRole === 'nursery'){
            localStorage.setItem('nurseryId' , res.manageId);
          }
          
          localStorage.setItem('userId' , res.userId);
          this.router.navigateByUrl('/welcome')
          console.log(res)
        },
        error:err=>console.log('error' , err)
      }, )
    } 
  
  }
  hasDisplayableError(controlName : string):Boolean{
    const control = this.addForm.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) )
  }
}
