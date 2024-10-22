import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INursery } from '../nursery';
import { NursaryService } from '../nursary.service';
import { Observable, Subscription } from 'rxjs';
import { ICompany } from '../../company/company';
import { CompanyService } from '../../company/company.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-nursary',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-nursary.component.html',
  styleUrl: './edit-nursary.component.css'
})
export class EditNursaryComponent implements OnInit, OnDestroy{
  editForm!: FormGroup;
  companies: ICompany[] = [];
  companies$!: Observable<ICompany[]>;
  @Input() oldNursary!: INursery;
  @Output() closeModal = new EventEmitter<boolean>;
  private subscription!: Subscription;

  constructor(private fb: FormBuilder,
              private nursaryService: NursaryService,
              private companyService: CompanyService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }

  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.companies$ = this.companyService.getCompanies();

    this.subscription = this.companies$.subscribe(companies => {
    this.companies = companies;
    });


    this.editForm = this.fb.group({
      name: [this.oldNursary.name, [Validators.required, Validators.minLength(3)]],
      address: [this.oldNursary.address, [Validators.required, Validators.minLength(3)]],
      companyId: [this.oldNursary.companyId, [Validators.required]],
    })
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.nursaryService.updateNursary(this.oldNursary.id, this.editForm.value)
      .subscribe(
        response => {
          console.log('Nursary updated successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error updating nursary', error);
        }
      );
    }

    console.log(this.editForm);
    this.closeModal.emit(true);
  }
}
