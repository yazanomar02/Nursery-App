export interface ISupplier {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    isActive: boolean;
    orders: any[];
}