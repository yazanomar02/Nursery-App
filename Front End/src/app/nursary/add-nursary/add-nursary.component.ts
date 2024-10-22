import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NursaryComponent } from '../nursary.component';
import { NursaryService } from '../nursary.service';
import { ICompany } from '../../company/company';
import { Observable, Subscription } from 'rxjs';
import { CompanyService } from '../../company/company.service';
import { ICategory } from '../../category/category';
import { CategoryService } from '../../category/category.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-nursary',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-nursary.component.html',
  styleUrl: './add-nursary.component.css'
})
export class AddNursaryComponent implements OnInit, OnDestroy{
  isSubmitted : boolean = false;
  addForm!: FormGroup;
  @Output() closeModal = new EventEmitter<boolean>;
  companies: ICompany[] = [];
  companies$!: Observable<ICompany[]>;
  categories: ICategory[] = [];
  categories$!: Observable<ICategory[]>;
  private subscription!: Subscription;
  companyId: string | undefined;

  constructor(private fb: FormBuilder,
              private nursaryService: NursaryService,
              private companyService: CompanyService,
              private categoryService: CategoryService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"])
              }
  

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyId');
    
    if(companyId) {
      this.companyId = companyId;
    }
    else {
      this.companies$ = this.companyService.getCompanies();
      this.subscription = this.companies$.subscribe(companies => {
      this.companies = companies;
      });
    }
    
    this.categories$ = this.categoryService.getCategorys();
    this.subscription = this.categories$.subscribe(categories => {
    this.categories = categories;
    });

    this.addForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      address: ["", [Validators.required, Validators.minLength(3)]],
      companyId: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password : ['',[
        Validators.required ,
         Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleAddFormSubmit(){
    this.isSubmitted = true
    if (this.addForm.valid) {
    this.nursaryService.addNursary(this.addForm.value)
      .subscribe(
        response => {
          console.log('Nursery added successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error adding nursery', error);
        }
      );
    }

    console.log(this.addForm);
    this.closeModal.emit(true);
  }
  hasDisplayableError(controlName : string):Boolean{
    const control = this.addForm.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) )
  }
}
