import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  addForm!: FormGroup;
  @Output() closeModal = new EventEmitter<boolean>;
  
  constructor(private fb: FormBuilder,
              private customerService: CustomerService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.minLength(3)]],
      // lastName: ["", [Validators.required, Validators.minLength(3)]],
      // address: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      // phoneNumber: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  handleAddFormSubmit(){

    if (this.addForm.valid) {
    this.customerService.addCustomer(this.addForm.value)
      .subscribe(
        response => {
          console.log('Customer added successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error adding Customer', error);
        }
      );
    }

    console.log(this.addForm);
    this.closeModal.emit(true);
  }
}
