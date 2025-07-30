export interface clientDTO{
    name: string;
    email: string;
    phone: string
}

export interface ClientListDTO {
    id: number;
    name?: string;
    phone?: string;
    email?: string | null;
}

export interface ClientUpdateDTO {
    name?: string;
    phone?: string;
    email?: string;
}
