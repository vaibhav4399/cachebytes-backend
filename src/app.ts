import express, {Application} from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import RedisStore from 'connect-redis';


//** Create express application */

const app: Application = express();


//** Load Built in Middlewares */

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(compression());


//** Load Custom Middlewares */
//TODO: Load the Error handling and Logging middlewares */


//** Define the routes */


export default app;