import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { ICart, ICartItem } from './cart';
import { CartIdService, CartService } from './cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  totalPrice = 0;
  cart$!: Observable<ICart>;
  message?: string;
  cart!: ICart;
  modalRefConferm?: BsModalRef;
  cartItems: ICartItem[] = [];
  private subscription: Subscription = new Subscription();
  hoverIndex: number = -1;
  userId: string = "";

  constructor(
    private cartService: CartService,
    private modalService: BsModalService,
    private cartIdService: CartIdService,
    private translate: TranslateService) {
    this.cartItems = [];
    translate.addLangs(["en", "ar"]);
  }
  /*
  ngOnInit() {
  // الاشتراك في التحديثات التلقائية للسلة
  this.cartService.cart$.subscribe(cart => {
    this.cart = cart;
    this.cartItems = cart ? cart.cartItems : []; // تحديث العناصر المعروضة
  });

  // جلب السلة الأولية
  this.cartService.getCart(this.cart.id);
}

  */
  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      if(cart){
        this.cart = cart  ;
      }
      this.cartItems = cart ? cart.cartItems : []; // تحديث العناصر المعروضة
    });
  
    // جلب السلة الأولية
    this.cartService.getCart(this.cart.id);
    this.userId = localStorage.getItem('userId') ?? ''; 
    this.subscription.add(
      this.cartIdService.getCartId().subscribe(cartId => {
        if (cartId) {
          this.cart$ = this.cartService.getCart(cartId);
          this.subscription.add(
            this.cart$.subscribe(cart => {
              this.cart = cart;
  
              // Ensure cart is not undefined before accessing cartItems
              if (this.cart && this.cart.cartItems) {
                this.cartItems = [...this.cart.cartItems];
                // console.log('Cart Items:', this.cartItems);
                // console.log('Cart Items Length:', this.cartItems.length);
  
                // Calculate the total price after receiving cart items
                this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.total, 0);
              } else {
                console.log('Cart is undefined or does not have cartItems.');
              }
            })
          );
        } else {
          console.log('No cart ID found.');
        }
      })
    );
  }
  
  openModalConfirm(template: TemplateRef<void>) {
    this.modalRefConferm = this.modalService.show(template, { class: 'modal-sm' });
  }
  confirm(): void {
    this.message = 'Confirmed!';
    this.cartService.confirm(this.cart.id, 0, this.userId).subscribe(
      response => {
         console.log('Order Confirm successfully', response);
         window.location.reload();
       },
      error => {
        console.error('Error ', error);
      }
    );
    this.modalRefConferm?.hide();
  }
  
  decline(): void {
    this.message = 'Declined!';
    this.modalRefConferm?.hide();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeFromCart(cartItemId: string) {
    this.cartService.DeleteCartItem(this.cart.id, cartItemId).subscribe(
      response => {
        console.log('Item removed:', response); // تحقق من محتوى الرد
        // بعد حذف العنصر، سيتم تحديث السلة تلقائيًا في cartService باستخدام getCart()
      },
      error => {
        console.error('Error removing item:', error);
      }
    );
  }
  
  
  
  

  trackById(index: number, item: ICartItem): string {
    return item.id; // تأكد من أن لكل عنصر مفتاح مميز مثل `id`
  }
}
