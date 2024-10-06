import { Request, Response, NextFunction } from "express";

/**
 ** Class to create a Common Error message for API
*/

class customAPIError extends Error {
    
    status: number;

    constructor(status: number = 500, message: string){
        super(message);
        this.status = status;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}


/**
 * * Function to handle the Errors occured in the API
 * @param error Error object of type CustomAPIError or Error
 * @param _req HTTP Request Variable
 * @param res HTTP Response Variable
 * @param _next Next Function
 * @returns Error Response with an Appropiate message
 */

const errorHandler = (error: customAPIError | Error, _req: Request, res: Response, _next: NextFunction) => {

    if(error instanceof customAPIError){
        const response = {
            status: error.status,
            message: error.message,
            timestamp: new Date().toISOString()
        }

        return res.status(error.status).json(response);
    }

    const response = {
        status: 500,
        message: "Internal Server Error",
        timestamp: new Date().toISOString()
    }

    return res.status(500).json(response);

}

export default errorHandler;

export { customAPIError };