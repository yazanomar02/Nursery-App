import { INursery } from "../nursary/nursery";

export interface ICompany{
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    nurseries: INursery[];
    address: string;
    email: string;
    phoneNumber: string;
}