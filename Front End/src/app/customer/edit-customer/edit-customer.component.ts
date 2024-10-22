import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICustomer } from '../customer';
import { CustomerService } from '../customer.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent {
  editForm!: FormGroup;
  @Input() oldCustomer!: ICustomer;
  @Output() closeModal = new EventEmitter<boolean>;

  constructor(private fb: FormBuilder,
              private customerService: CustomerService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      fullName: [this.oldCustomer.fullName, [Validators.required, Validators.minLength(3)]],
      // lastName: [this.oldCustomer.lastName, [Validators.required, Validators.minLength(3)]],
      // address: [this.oldCustomer.address, [Validators.required, Validators.minLength(3)]],
      email: [this.oldCustomer.email, [Validators.required, Validators.email]],
      // phoneNumber: [this.oldCustomer.phoneNumber, [Validators.required, Validators.minLength(8)]]
    });
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.customerService.updateCustomer(this.oldCustomer.id, this.editForm.value)
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
