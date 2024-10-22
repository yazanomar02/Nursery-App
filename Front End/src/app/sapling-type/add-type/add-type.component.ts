import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISaplingType } from '../sapling-type';
import { TypeService } from '../type.service';
import { ICategory } from '../../category/category';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from '../../category/category.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-type',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-type.component.html',
  styleUrl: './add-type.component.css'
})

export class AddTypeComponent implements OnInit, OnDestroy{
  Categories$!: Observable<ICategory[]>;
  Categories: ICategory[] = [];
  private subscription!: Subscription;

  addForm!: FormGroup;
  @Output() closeModal = new EventEmitter<boolean>;

  constructor(private fb: FormBuilder,
              private saplingTypeService: TypeService,
              private categoryService : CategoryService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }
              
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    this.Categories$ = this.categoryService.getCategorys();

    this.subscription = this.Categories$.subscribe(saplings => {
      this.Categories = saplings;
    });
    
    this.addForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(5)]],
      description: ["", [Validators.required, Validators.minLength(5)]],
      categoryId: ["", [Validators.required, Validators.minLength(5)]],
    });
  }

  handleAddFormSubmit(){

    if (this.addForm.valid) {
    this.saplingTypeService.addSaplingType( this.addForm.value)
      .subscribe(
        response => {
          console.log('SaplingType added successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error adding saplingType', error);
        }
      );
    }

    console.log(this.addForm);
    this.closeModal.emit(true);
  }


  
}
