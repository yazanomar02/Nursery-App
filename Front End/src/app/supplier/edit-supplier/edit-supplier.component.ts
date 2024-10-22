import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISupplier } from '../supplier';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'app-edit-supplier',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.css'
})
export class EditSupplierComponent {
  editForm!: FormGroup;
  @Input() oldSupplier!: ISupplier;
  @Output() closeModal = new EventEmitter<boolean>;

  constructor(private fb: FormBuilder, private supplierService: SupplierService) {

  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      firstName: [this.oldSupplier.firstName, [Validators.required, Validators.minLength(3)]],
      lastName: [this.oldSupplier.lastName, [Validators.required, Validators.minLength(3)]],
      address: [this.oldSupplier.address, [Validators.required, Validators.minLength(3)]],
      email: [this.oldSupplier.email, [Validators.required, Validators.email]],
      phoneNumber: [this.oldSupplier.phoneNumber, [Validators.required, Validators.minLength(8)]]
    });
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.supplierService.updateSupplier(this.oldSupplier.id, this.editForm.value)
      .subscribe(
        response => {
          console.log('Supplier updated successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error updating supplier', error);
        }
      );
    }

    console.log(this.editForm);
    this.closeModal.emit(true);
  }
}
