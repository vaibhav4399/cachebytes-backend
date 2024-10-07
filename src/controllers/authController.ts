import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcrypt';
import dbPool from "../config/dbConnection";
import { PoolClient } from "pg";
import redisClient from "../config/redisConnection";
import { customAPIError } from "../middlewares/errorHandler";
import { generateToken, refreshTokenCreate } from "../middlewares/authValidation";
import { USERTABLE } from "../config/environment";


/**
 * * Function to handle the registration of new User
 * @param req HTTP Request
 * @param res HTTP Response
 * @param next Next Function
 */

const register = async (req: Request, res: Response, next: NextFunction) => {
    
    const client: PoolClient = await dbPool.connect();
    if(!client) throw new Error("Could not create the client from the database pool");

    try {
        const {username, email, password} = req.body;

        let user = await client.query(`SELECT * from ${USERTABLE} where username = $1`, [username]);
        
        if(user.rowCount) throw new customAPIError(400, "The user with the given username already exists");

        const userId = uuidv4();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await client.query(`INSERT INTO ${USERTABLE} (id, username, email, password) values ($1, $2, $3, $4) RETURNING id`, [userId, username, email, hashedPassword]);

        if(newUser.rowCount == 0) throw new customAPIError(500, "Something went wrong when creating a new user");

        const payload = {
            user: {
                id: newUser.rows[0].id
            }
        }

        const {accessToken, refreshToken} = generateToken(payload);

        req.session.userID = newUser.rows[0].id;
        req.session.refreshToken = refreshToken;

        const response = {
            userID: newUser.rows[0].id,
            accessToken: accessToken
        }

        res.cookie('session.id', req.sessionID, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json(response);

    }
    catch(error){
        next(error);
    }
    finally{
        client.release();
    }

}

/**
 * * Function to handle the login for the user
 * @param req HTTP Request
 * @param res HTTP Response
 * @param next Next Function
 */

const login = async (req: Request, res: Response, next: NextFunction) => {

    const client: PoolClient = await dbPool.connect()
    if(!client) throw new Error("Could not create a client from the database pool");

    try {

        const {username, password} = req.body;

        const user = await client.query(`SELECT * FROM ${USERTABLE} where username = $1`, [username]);

        if(user.rowCount == 0) throw new customAPIError(401, "The User with the given Username does not exists");

        const passMatch = await bcrypt.compare(password, user.rows[0].password);

        if(!passMatch) throw new customAPIError(401, "Invalid Credentials");

        const payload = {
            user: {
                id: user.rows[0].id
            }
        }

        const {accessToken, refreshToken} = generateToken(payload);

        req.session.userID = user.rows[0].id;
        req.session.refreshToken = refreshToken;

        const response = {
            userID: user.rows[0].id,
            accessToken: accessToken
        }

        res.cookie('session.id', req.sessionID, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json(response);

    }
    catch(error){
        next(error);
    }
    finally{
        client.release();
    }

}

/**
 * * Function to refresh the token for the user
 * @param req HTTP Request
 * @param res HTTP Response
 * @param next Next Function
 */

const tokenRefresh = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const sessionID = req.cookies['session.id'];

        if (!sessionID) throw new customAPIError(400, "Session not found for the user");

        const sessionData = await redisClient.get(`sess:${sessionID}`);

        if(!sessionData) throw new customAPIError(401, "Session not found for the user");

        const sessionDataParsed = JSON.parse(sessionData);
        const refreshToken = sessionDataParsed.refreshToken;
        const userID = sessionDataParsed.userID;
        

        if (!refreshToken) throw new customAPIError(401, "Unauthorized Access");

        const accessToken = refreshTokenCreate(refreshToken);

        const response = {
            userID: userID,
            accessToken: accessToken
        }

        res.cookie('session.id', sessionID, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json(response);

    }
    catch(error){
        next(error);
    }

}


/**
 * * Function to check if the user session already exists
 * @param req HTTP Request
 * @param res HTTP Response
 * @param next Next Function
 * @returns 
 */

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionID = req.cookies['session.id'];

        if(!sessionID){
            throw new customAPIError(401, "The User session was not found");
            return;
        }

        req.sessionID = sessionID;

        const sessionData = await redisClient.get(`sess:${sessionID}`);

        if (!sessionData) throw new customAPIError(401, "Session not found for the user");

        const sessionDataParsed = JSON.parse(sessionData);
        const refreshToken = sessionDataParsed.refreshToken;
        const userID = sessionDataParsed.userID;

        if (!refreshToken) throw new customAPIError(401, "Unauthorized Access");

        const accessToken = refreshTokenCreate(refreshToken);

        const response = {
            userID: userID,
            accessToken: accessToken
        }

        res.cookie('session.id', sessionID, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json(response);

    }
    catch(error){
        next(error);
    }
}



export const authController = {
    register,
    login,
    tokenRefresh,
    checkUser
}