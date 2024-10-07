import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/environment";
import { customAPIError } from "./errorHandler";


interface IPayload {
    user: {
        id: string
    }
}

/**
 * * Function to generate the JWT  Token
 * @param payload Payload data for the Creation of token
 * @returns Access and Refresh Token
 */


const generateToken = (payload: IPayload ) => {

    try {
        const accessToken = jwt.sign(payload, JWT_SECRET, {expiresIn: '12h'});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '5d'});
        return {accessToken, refreshToken};
    }
    catch(error){
        throw new customAPIError(500, error?.toString()?? "Internal server Error");
    }

}

/**
 * * Function to verify the JWT token
 * @param req HTTP Request
 * @param _res HTTP Response
 * @param next Next Function
 */


const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
    const token: string | boolean = req.headers['authorization']?.split(" ")[1]?? false;

    try{
        if(!token) throw new customAPIError(400, "Token not found for the particular user");
        
        const decoded = jwt.verify(token, JWT_SECRET) as string | IPayload;

        if(typeof decoded !== "string"){
            if(decoded && decoded.user){
                req.userID = decoded.user.id;
                next();
            }
            else{
                throw new customAPIError(500, "Something went wrong while verifying token");
            }
        }
        else{
            throw new customAPIError(401,  "Invalid Token provided");
        }

    }
    catch(error){
        next(error)
    }


}


/**
 * * Function to refresh the JWT Token
 * @param refreshToken refreshToken to verify
 * @returns Returns the new Access Token
 */

const refreshTokenCreate = async (refreshToken: string) => {

    let newAccessToken;

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as string | IPayload;

    if (typeof decoded !== 'string') {
        if (decoded && decoded.user) {
            newAccessToken = jwt.sign({ user: { id: decoded.user.id } }, JWT_SECRET, { expiresIn: '12h' });
            return newAccessToken;
        }
    }
    else {
        throw new customAPIError(401, "Unauthorized access");
    }

}


export {
    generateToken,
    verifyToken,
    refreshTokenCreate
}