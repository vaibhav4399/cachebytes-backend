import dotenv from 'dotenv'

//** Check the Envionment and load the appropiate file */

const envFile: string = process.env.NODE_ENV === 'production' ? '.env.production': '.env.development';
dotenv.config({path: envFile});

//** Export the port */

export const PORT: string = process.env.PORT || '3000';