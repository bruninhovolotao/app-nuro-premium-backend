import { Request, Response, NextFunction } from "express";
import { onError } from "../utils/on-error";
import { HTTPError } from "../utils/http.error";
import { Tipo } from '@prisma/client'

export function ensureTipo(req: Request, res: Response, next: NextFunction){

  try {
    const user  = req.user
    
    if( user?.role === Tipo.USER ){
      throw new HTTPError(403, "Acesso negado para esse recurso")
    }

    return next()

  } catch (error) {
    onError(error, res)
  }

}