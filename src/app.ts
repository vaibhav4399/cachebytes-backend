import express, {Application} from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import RedisStore from 'connect-redis';
import errorHandler from './middlewares/errorHandler';
import redisClient from './config/redisConnection';
import { REDIS_SESSION_SECRET } from './config/environment';

import authRouter from './routes/authRoutes';


//** Create express application */

const app: Application = express();


const redisStore = new RedisStore({
    client: redisClient
})

//** Load Built in Middlewares */

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(session({
    store: redisStore,
    resave: false,
    secret: REDIS_SESSION_SECRET,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    }
}))


//** Define the routes */

app.use('/api/auth', authRouter);



//** Error Handling Middlewares */
app.use(errorHandler);


export default app;