import express from 'express';
import 'express-session';


declare global {
    namespace Express {
        interface Request {
            userID?:  string
        }
    }
}

declare module 'express-session' {
    interface SessionData {
        userID: string;
        refreshToken: string
    }
}