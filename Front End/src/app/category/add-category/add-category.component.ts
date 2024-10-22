import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  addForm!: FormGroup;
  @Output() closeModal = new EventEmitter<boolean>;
  constructor(private fb: FormBuilder,
              private categoryService: CategoryService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  handleAddFormSubmit(){

    if (this.addForm.valid) {
    this.categoryService.addCategory(this.addForm.value)
      .subscribe(
        response => {
          console.log('Sapling updated successfully', response);
          window.location.reload();

        },
        error => {
          console.error('Error updating sapling', error);
        }
      );
    }

    console.log(this.addForm);
    this.closeModal.emit(true);
  }
}


