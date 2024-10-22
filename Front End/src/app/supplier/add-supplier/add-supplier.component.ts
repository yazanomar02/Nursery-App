import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.css'
})
export class AddSupplierComponent {
  addForm!: FormGroup;
  @Output() closeModal = new EventEmitter<boolean>;
  constructor(private fb: FormBuilder, private supplierService: SupplierService) {

  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
      address: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  handleAddFormSubmit(){

    if (this.addForm.valid) {
    this.supplierService.addSupplier(this.addForm.value)
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
}
