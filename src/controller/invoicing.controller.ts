import { InvoicingService } from "../service/invoicing.service";
import { Request, Response} from 'express';
import { onError } from "../utils/on-error";

export class invoicingController{
    public async invoicing(req: Request, res: Response){
        const { startDate, endDate } = req.query;

        try {
        const service = new InvoicingService();

        const report = await service.invoicing(startDate as string, endDate as string);
        
        res.status(200).json({
            sucess: true,
            message: 'Dados de faturamento carregados com sucesso',
            data: report
        })
        
        } catch (error) {
        onError(error, res)
        }
    }
}