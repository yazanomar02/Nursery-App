import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule ,RouterLink, TranslateModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {

  addForm!: FormGroup;
  isSubmitted : boolean = false;

  constructor(private formBuilder : FormBuilder,
              protected service : AuthService,
              private router: Router,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
                translate.setDefaultLang("en");
              }


  passwordMatchValidator : ValidatorFn = (control : AbstractControl) : null =>{
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')
    if(password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({passwordMismatch : true})
    else
      confirmPassword?.setErrors(null)
    return null;
  }
  ngOnInit(): void {

    this.addForm = this.formBuilder.group({
      fullName : ['',Validators.required ],
      email : ['',[Validators.required , Validators.email] ],
      password : ['',[
        Validators.required ,
         Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
      confirmPassword : ['' ],
    },{validators:this.passwordMatchValidator})
  }

  onSubmit(){
    this.isSubmitted = true
    this.service.createUser(this.addForm.value)
    .subscribe({
      next:(res:any)=>{     
        if(res.succeeded){
          this.addForm.reset();
          this.isSubmitted = false;
        } 
        console.log(res)
        this.router.navigateByUrl('/signin');
      },
      error:err=>console.log('error' , err)
    })
  }
  hasDisplayableError(controlName : string):Boolean{
    const control = this.addForm.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) )
  }
}

