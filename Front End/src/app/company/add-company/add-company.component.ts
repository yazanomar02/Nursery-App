import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../company.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css'
})
export class AddCompanyComponent {
  isSubmitted : boolean = false;
  addForm!: FormGroup;
  @Output() closeModal = new EventEmitter<boolean>;
  constructor(private fb: FormBuilder, private companyService: CompanyService, private translate: TranslateService) {
    translate.addLangs(["en", "ar"]);
  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      address: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.required, Validators.minLength(8)]],
      password : ['',[
        Validators.required ,
         Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    });
  }

  handleAddFormSubmit(){
    this.isSubmitted = true
    if (this.addForm.valid) {
    this.companyService.addCompany(this.addForm.value)
      .subscribe(
        response => {
          console.log('Company added successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error adding company', error);
        }
      );
    }

    console.log(this.addForm);
    this.closeModal.emit(true);
  }
  hasDisplayableError(controlName : string):Boolean{
    const control = this.addForm.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) )
  }
}
