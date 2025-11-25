export interface userDTO{
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    tipo: 'USER'| 'ADMIN';
}
export interface userUpdateDTO{
    id: number;
    name?: string;
    email?: string;
    username?: string;
    password?: string;
}

export interface loginDTO{
    username: string;
    password: string;
}


