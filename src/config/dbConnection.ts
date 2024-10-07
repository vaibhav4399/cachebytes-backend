import { Pool, PoolClient } from "pg";
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DB } from "./environment";

//** Create a Connection pool for the database */

const dbPool = new Pool({
    user: DB_USER,
    port: DB_PORT,
    host: DB_HOST,
    password: DB_PASS,
    database: DB_DB,
    max: 20,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 3000
});


//** Function to check the creation of the Connection Pool */

const checkPoolConnection = async () => {
    
    try {
        const client: PoolClient = await dbPool.connect();
        client.release();
    }
    catch(error){
        throw new Error(error?.toString());
    }

}

checkPoolConnection();


export default dbPool;