import { prismaClient } from "../database/prisma.client";
import { User, Tipo  } from "@prisma/client"
import { loginDTO, userDTO, userUpdateDTO } from "../dto/login.dto";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { HTTPError } from "../utils/http.error";

type UserPartial = Omit<User, "password">

export class loginService {
    public async signup({name, email, username, password, tipo}: userDTO): Promise<UserPartial>{

        const existingUser = await prismaClient.user.findFirst({
            where: {
                username: username,
                email: email
            }
        })

        if(existingUser){
            throw new Error("Usuário já cadastrado");
        }

        const passwordCripted = await bcrypt.hash(password, 10);

        const newUser = await prismaClient.user.create({
            data:{
                name,
                email,
                username,
                password: passwordCripted,
            }
        })

        const { password: _, ...userPartial } = newUser;
        return userPartial;
    }
    public async list(userId: number) {
        const user = await prismaClient.user.findMany({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                password: true
            }
        })

        return user
    }
    public async login(data: loginDTO): Promise< {token: string, user: object} > {
        const { username, password } = data

        let user = await prismaClient.user.findFirst({
            where:{ username } 
        })

        if(!user){
            throw new HTTPError(401, "Usuário não encontrado")
        }

        const validPassword = await bcrypt.compare( password, user.password)

        if(!validPassword){
            throw new HTTPError(401, "Senha inválida")
        }

        const token = randomUUID();

        user = await prismaClient.user.update({
            where: { id: user.id },
            data: { authToken: token },
        });

        const { password: _, ...usuarioSemSenha } = user;

        return { user: usuarioSemSenha, token}

    }
    public async getByToken(authToken: string): Promise<Omit<User, "password"> | null>{
        const user = await prismaClient.user.findFirst({
            where:{ authToken },
        });

        return user;
    }
    public async update({id, name, email, username, password}: userUpdateDTO){
        
        const dataUpdate: any = {};

        if(name !== undefined) dataUpdate.name = name
        if(email !== undefined) dataUpdate.email = email
        if(username !== undefined) dataUpdate.username = username

        if(password){
            const passwordCripted = await bcrypt.hash(password, 10);
            dataUpdate.password = passwordCripted
        }

        const updateUser = await prismaClient.user.update({
            where: { id },
            data: dataUpdate
        })

        const { password: _, ...userPartial } = updateUser;
        return userPartial;
    }
    public async delete(id: number) {
      
      const userExists = await prismaClient.user.findUnique({
          where: { id }
        });
    
        if (!userExists) {
          throw new HTTPError(404, "Usuário não encontrado.");
        }

        await prismaClient.user.delete({
            where: userExists
        })
    }
}