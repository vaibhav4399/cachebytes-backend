import dotenv from 'dotenv'

//** Check the Envionment and load the appropiate file */

const envFile: string = process.env.NODE_ENV === 'production' ? '.env.production': '.env.development';
dotenv.config({path: envFile});

//** Export the port */

export const PORT: string = process.env.PORT || '3000';


//** Export the Database configurations */

export const DB_HOST: string = process.env.DB_HOST || 'localhost';
export const DB_PORT: number = Number(process.env.DB_PORT) || 1234 ;
export const DB_USER: string = process.env.DB_USER || '';
export const DB_PASS: string = process.env.DB_PASS || '';
export const DB_DB: string = process.env.DB_DB || '';
export const USERTABLE: string = process.env.USERTABLE || '';
export const POSTTABLE: string = process.env.USERTABLE || '';
export const TAGTABLE: string = process.env.USERTABLE || '';
export const USERPOSTABLE: string = process.env.USERTABLE || '';
export const POSTTAGTABLE: string = process.env.USERTABLE || '';


//** Export JWT token secret and refresh secret */

export const JWT_SECRET: string = process.env.JWT_SECRET || 'test';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh';


//** Export redis session secret */

export const REDIS_SESSION_SECRET = process.env.REDIS_SESSION_SECRET || 'test';