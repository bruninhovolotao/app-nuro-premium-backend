import { prismaClient } from "../database/prisma.client";
import { User } from "@prisma/client"
import { loginDTO, userDTO } from "../dto/login.dto";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { HTTPError } from "../utils/http.error";

type UserPartial = Omit<User, "password">

export class loginService {
    public async signup(data: userDTO): Promise<UserPartial>{
        const { name, email, password } = data;

        const existingUser = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if(existingUser){
            throw new Error("E-mail já cadastrado");
        }

        const passwordCripted = await bcrypt.hash(password, 10);

        const newUser = await prismaClient.user.create({
            data:{
                name,
                email,
                password: passwordCripted
            }
        })

        const { password: _, ...userPartial } = newUser;
        return userPartial;
    }

    public async login(data: loginDTO): Promise< {token: string, user: object} > {
        const { email, password } = data

        let user = await prismaClient.user.findFirst({
            where:{
                OR: [
                    { email },
                    { password }
                    ]
                }
        })

        if(!user){
            throw new HTTPError(401, "E-mail ou Usuário não encontrado")
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
}