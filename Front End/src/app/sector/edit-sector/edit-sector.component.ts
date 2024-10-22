import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISector } from '../sector';
import { SectorService } from '../sector.service';
import { INursery } from '../../nursary/nursery';
import { Observable, Subscription } from 'rxjs';
import { NursaryService } from '../../nursary/nursary.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-sector',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-sector.component.html',
  styleUrl: './edit-sector.component.css'
})
export class EditSectorComponent implements OnInit, OnDestroy{
  editForm!: FormGroup;
  @Input() oldSector!: ISector;
  @Output() closeModal = new EventEmitter<boolean>;
  nurseries: INursery[] = [];
  nurseries$!: Observable<INursery[]>;
  private subscription!: Subscription;

  constructor(private fb: FormBuilder,
              private sectorService: SectorService,
              private nursaryService: NursaryService, 
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.nurseries$ = this.nursaryService.getNursaries();

    this.subscription = this.nurseries$.subscribe(nurseries => {
    this.nurseries = nurseries;
    });

    this.editForm = this.fb.group({
      number: [this.oldSector.number, [Validators.required]],
      capacity: [this.oldSector.capacity, [Validators.required]],
      nurseryId: [this.oldSector.nurseryId, [Validators.required]],
    });
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.sectorService.updateSector(this.oldSector.id, this.editForm.value)
      .subscribe(
        response => {
          console.log('Sector updated successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error updating sector', error);
        }
      );
    }

    console.log(this.editForm);
    this.closeModal.emit(true);
  }
}
