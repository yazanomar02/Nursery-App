import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICategory } from '../../category/category';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from '../../category/category.service';
import { TypeService } from '../../sapling-type/type.service';
import { SaplingcategoryService } from '../saplingcategory.service';
import { ISaplingsCategory } from '../saplingcategory';
import { ISaplingType } from '../../sapling-type/sapling-type';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-add-saplingcategory',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-saplingcategory.component.html',
  styleUrl: './add-saplingcategory.component.css'
})


export class AddSaplingcategoryComponent implements OnInit{
  Saplingstypes$!: Observable<ISaplingType[]>;
  Saplingstypes: ISaplingType[] = [];
  private subscription!: Subscription;
  addForm!: FormGroup;

  @Output() closeModal = new EventEmitter<boolean>;

  constructor(private fb: FormBuilder,
     private typeService: TypeService,
     private saplingcategoryService : SaplingcategoryService,
     private translate: TranslateService) {
      translate.addLangs(["en", "ar"]);
      }

  ngOnInit(): void {
    this.Saplingstypes$ = this.typeService.getSaplingTypes();

    this.subscription = this.Saplingstypes$.subscribe(saplings => {
      this.Saplingstypes = saplings;
    });
    
    this.addForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(5)]],
      saplingTypeId: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  handleEditFormSubmit(){

    if (this.addForm.valid) {
    this.saplingcategoryService.addSaplingsCategory(this.addForm.value)
      .subscribe(
        response => {
          console.log('SaplingCtegory added successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error adding saplingCtegory', error);
        }
      );
    }

    console.log(this.addForm);
    this.closeModal.emit(true);
  }


  
}
