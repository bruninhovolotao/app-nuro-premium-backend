import { Request, Response, NextFunction } from "express";
import { onError } from "../utils/on-error";
import { HTTPError } from "../utils/http.error";
import { Tipo } from "@prisma/client"

export function ensureTipo(req: Request, res: Response, next: NextFunction){

  try {
    const user  = req.user

    if (!Tipo) {
      throw new HTTPError(500, "Tipo enum não está definido.");
    }

    if (!user) {
      throw new HTTPError(401, "Usuário não autenticado");
    }
    
    if( user?.tipo === Tipo.USER ){
      throw new HTTPError(403, "Acesso negado para esse recurso")
    }

    return next()

  } catch (error) {
    onError(error, res)
  }

}