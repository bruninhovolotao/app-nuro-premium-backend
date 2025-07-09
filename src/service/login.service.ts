import { prismaClient } from "../database/prisma.client";
import { User, Role } from "@prisma/client"
import { loginDTO, userDTO } from "../dto/login.dto";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { HTTPError } from "../utils/http.error";

type UserPartial = Omit<User, "password">

export class loginService {
    public async signup(data: userDTO): Promise<UserPartial>{
        const { name, email, username, password } = data;

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
                role: Role.USER
            }
        })

        const { password: _, ...userPartial } = newUser;
        return userPartial;
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
}