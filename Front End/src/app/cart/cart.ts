import { ICustomer } from "../customer/customer";
import { ISapling } from "../sapling/sapling";

export interface ICart {
    id: string;
    dateCreated: Date;
    customerId: string;
    customer?: ICustomer;
    cartItems: ICartItem[]  ;
}
export interface ICartItem {
    id: string;
    quantity: number;
    price: number;
    total: number; // Calculated total, usually set in logic
    isActive: boolean;
    cartId: string;
    cart?: ICart;
    saplingId: string;
    sapling?: ISapling;
  }
  