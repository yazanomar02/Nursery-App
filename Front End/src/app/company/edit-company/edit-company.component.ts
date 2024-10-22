import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../company.service';
import { ICompany } from '../company';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-company',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.css'
})
export class EditCompanyComponent implements OnInit{
  editForm!: FormGroup;
  @Input() oldCompany!: ICompany;
  @Output() closeModal = new EventEmitter<boolean>;
  constructor(private fb: FormBuilder, private companyService: CompanyService, private translate: TranslateService) {
    translate.addLangs(["en", "ar"]);
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.oldCompany.name, [Validators.required, Validators.minLength(3)]],
      address: [this.oldCompany.address, [Validators.required, Validators.minLength(3)]],
      description: [this.oldCompany.description, [Validators.required, Validators.minLength(10)]],
      email: [this.oldCompany.email, [Validators.required, Validators.email]],
      phoneNumber: [this.oldCompany.phoneNumber, [Validators.required, Validators.minLength(8)]]
    });
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.companyService.updateCompany(this.oldCompany.id, this.editForm.value)
      .subscribe(
        response => {
          console.log('Company updated successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error updating company', error);
        }
      );
    }

    console.log(this.editForm);
    this.closeModal.emit(true);
  }
}
