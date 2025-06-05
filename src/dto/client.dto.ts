export interface clientDTO{
    name: string;
    email: string;
    phone: string
}

export interface ClientUpdateDTO {
    name?: string;
    phone?: string;
    email?: string;
  }