import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISaplingType } from '../sapling-type';
import { TypeService } from '../type.service';
import { ICategory } from '../../category/category';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from '../../category/category.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-type',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-type.component.html',
  styleUrl: './edit-type.component.css'
})

export class EditTypeComponent implements OnInit, OnDestroy{

  Categories$!: Observable<ICategory[]>;
  Categories: ICategory[] = [];
  private subscription!: Subscription;

  
  editForm!: FormGroup;
  @Input() oldSaplingType!: ISaplingType;
  @Output() closeModal = new EventEmitter<boolean>;
  constructor(private fb: FormBuilder,
              private saplingTypeService: TypeService,
              private categoryService : CategoryService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }

  ngOnInit(): void {

    this.Categories$ = this.categoryService.getCategorys();

    this.subscription = this.Categories$.subscribe(saplings => {
      this.Categories = saplings;
    });

    this.editForm = this.fb.group({
      name: [this.oldSaplingType.name, [Validators.required, Validators.minLength(3)]],
      description: [this.oldSaplingType.description, [Validators.required, Validators.minLength(3)]],
      categoryId: [this.oldSaplingType.categoryId, [Validators.required, Validators.minLength(3)]],
    });
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.saplingTypeService.updateSaplingType(this.oldSaplingType.id, this.editForm.value)
      .subscribe(
        response => {
          console.log('SaplingType updated successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error updating saplingType', error);
        }
      );
    }

    console.log(this.editForm);
    this.closeModal.emit(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
