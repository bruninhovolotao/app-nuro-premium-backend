import { Request, Response, NextFunction } from "express";
import { onError } from "../utils/on-error";
import { HTTPError } from "../utils/http.error";
import { Role } from '@prisma/client'

export async function ensureRole(req: Request, res: Response, next: NextFunction){

  try {
    const role  = req.user
    
    if( role?.role === Role.USER ){
      throw new HTTPError(403, "Acesso negado para esse recurso")
    }

    return next()

  } catch (error) {
    onError(error, res)
  }

}