import { Role } from './../enums/roles';

export type UserFirestoreDTO = {
    userId: string;
    role: Role;
    createdAt: string;
    deviceToken: string;
};
