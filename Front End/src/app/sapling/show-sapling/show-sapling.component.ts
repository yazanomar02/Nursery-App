import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ISapling } from '../sapling';
import { SaplingService } from '../sapling.service';
import { CartIdService, CartService } from '../../cart/cart.service';
import { ICart } from '../../cart/cart';
import { NursaryService } from '../../nursary/nursary.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-show-sapling',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './show-sapling.component.html',
  styleUrls: ['./show-sapling.component.css']
})
export class ShowSaplingComponent implements OnInit, OnDestroy {

  userId : string = "";
  nurseryId! : string;
  nurseryName! : string ;

  saplings$!: Observable<ISapling[]>;
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  modalRefAdd?: BsModalRef;
  message?: string;
  saplings: ISapling[] = [];
  saplingName!: string;
  totalCountCarts : number = 0;
  cart! : ICart 
  cart$! : Observable<ICart>
  // مؤشر الشتلة الحالي للتمرير فوقها
  hoverIndex: number | null = null;


  private subscription!: Subscription;
  private _searchWord: string = "";

  public get searchWord(): string {
    return this._searchWord;
  }

  public set searchWord(v: string) {
    this._searchWord = v;
  }

  constructor(
    private saplingService: SaplingService,
    private nurseryService : NursaryService,
    private modalService: BsModalService,
    private cartService: CartService ,
    private cartIdService : CartIdService,
    private translate: TranslateService) {
      translate.addLangs(["en", "ar"]);
    }

  ngOnDestroy(): void {
    // this.userId = localStorage.getItem('userId') ?? ''; 
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  
  }
  
  ngOnInit(): void {

    this.userId = localStorage.getItem('userId') ?? ''; 
    this.saplings$ = this.saplingService.getSaplins();
    this.subscription = this.saplings$.subscribe(saplings => {
      this.saplings = saplings;
      this.saplings.forEach(sapling => sapling.quantity = 1); 
    });
  }
  nurseryCache: { [key: string]: string } = {}; // كاش لحفظ أسماء المشاتل

  getNurseryName(sap: ISapling): string {
    if (sap.nurseryId) {
      // تحقق مما إذا كان الاسم موجودًا بالفعل في الكاش
      if (this.nurseryCache[sap.nurseryId]) {
        return this.nurseryCache[sap.nurseryId];
      } else {
        // إذا لم يكن في الكاش، أرسل طلبًا لاسترداد الاسم
        this.nurseryService.getNursery(sap.nurseryId).subscribe(nur => {
          this.nurseryCache[sap.nurseryId] = nur.name; // حفظ الاسم في الكاش
          this.nurseryName = nur.name;
        });
      }
    }
    return this.nurseryName;
  }
  
  

  increaseQuantity(sapling: ISapling) {
    if(sapling.amount > sapling.quantity){
      sapling.quantity++;
    }
  }

  decreaseQuantity(sapling: ISapling) {
    if (sapling.quantity > 1) {
      sapling.quantity--;
    }
  }

  addToCart(sapling: ISapling) {
    const savedCartId = localStorage.getItem('cartId');
    
    if (!savedCartId) {
      this.cartService.addToCart(sapling.id, sapling.quantity , this.userId ).pipe(
        switchMap(response => {
          console.log('Added to cart:', response);
          this.cart = response;
          this.totalCountCarts++;
          
          localStorage.setItem('cartId', this.cart.id);
          this.cartIdService.setCartId(this.cart);
          return this.cartIdService.getCartId();
        })
      ).subscribe(
        cartId => {
          console.log('CartId set successfully:', cartId);
        },
        error => {
          console.error('Error adding to cart:', error);
        }
      );
    } 
    else {
      this.cartService.addToCart(sapling.id, sapling.quantity, this.userId, savedCartId).subscribe(
        response => {
          console.log('Added to cart:', response);
        },
        error => {
          console.error('Error adding to cart:', error);
        }
      );
      console.log('cartId:', savedCartId);
      console.log('saplingId:', sapling.id);
      console.log('quantity:', sapling.quantity);
    }
  
    sapling.quantity = 1; 
  }
  

  
  openModalUpdate(template: TemplateRef<void>) {
    this.modalRefUpdate = this.modalService.show(template);
  }

  closeModalUpdate() {
    this.modalService.hide(this.modalRefUpdate?.id);
    window.location.reload();
  }

  openModalDelete(template: TemplateRef<void>) {
    this.modalRefDelete = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(id: string): void {
    this.message = 'Confirmed!';
    this.saplingService.deleteSapling(id).subscribe(
      response => {
        console.log('Sapling deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting sapling', error);
      }
    );
    this.modalRefDelete?.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchSapling(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (this.searchWord.trim() === '') {
      this.saplings$.subscribe(saplings => {
        this.saplings = saplings;
        this.saplings.forEach(sapling => {
          sapling.quantity = 1;  // تعيين الكمية إلى 1 لكل شتلة
        });
      });
    }

    else {
      this.saplings$.subscribe(saplings => {
        this.saplings = saplings.filter(c =>
          c.barCode.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
        // تعيين الكمية إلى 1 لكل شتلة بعد الفلترة
        this.saplings.forEach(sapling => {
          sapling.quantity = 1;
        });
      });
    }
  }


  toggleHover(isHovered: boolean, index: number): void {
    this.hoverIndex = isHovered ? index : null;
  }
}
