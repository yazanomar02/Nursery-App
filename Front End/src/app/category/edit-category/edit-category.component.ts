import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategory } from '../category';
import { CategoryService } from '../category.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})

export class EditCategoryComponent implements OnInit{
  editForm!: FormGroup;
  @Input() oldCategory!: ICategory;
  @Output() closeModal = new EventEmitter<boolean>;
  constructor(private fb: FormBuilder,
              private categoryService: CategoryService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.oldCategory.name, [Validators.required, Validators.minLength(3)]],
    });
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.categoryService.updateCategory(this.oldCategory.id, this.editForm.value)
      .subscribe(
        response => {
          console.log('Category updated successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error updating category', error);
        }
      );
    }

    console.log(this.editForm);
    this.closeModal.emit(true);
  }


  
}
