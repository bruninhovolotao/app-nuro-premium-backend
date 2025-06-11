import { Response } from "express";
import { HTTPError } from "./http.error";

export function onError(error: unknown, res: Response){
    if(error instanceof HTTPError){
        res.status(error.statusCode).json({
            sucess: false,
            message: error.message,
            });
            return;
    }
    
    res.status(500).json({
        sucess: false,
        message: "Ocorreu um erro inesperado",
        details: (error as Error).message,
    })
}