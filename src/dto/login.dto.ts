export interface userDTO{
    name: string;
    email: string;
    username: string;
    phone: string;
    password: string;
    tipo: 'USER'| 'ADMIN';
}

export interface loginDTO{
    username: string;
    password: string;
}


