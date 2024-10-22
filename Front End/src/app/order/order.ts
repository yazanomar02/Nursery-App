import { INursery } from "../company/nursery";
import { ICustomer } from "../customer/customer";

export interface IOrder{
    id: string;
    dateOrder: string;
    totalPrice: number;
    afterDisCount: number;
    isActive: boolean;
    customerId: string;
    customer?: ICustomer;
    orderDetails: any[];
}