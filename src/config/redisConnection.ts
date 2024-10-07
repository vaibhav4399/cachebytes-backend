import { createClient, RedisClientType } from "redis";

/**
 * * Function to Establish a redis Connection
 * @returns Returns a redis Connection Client
 */

const initializeRedis = (): RedisClientType => {
    const redisClient: RedisClientType = createClient();

    redisClient.on('error', (error) => {
        console.log("There was an error when connecting to the redis", error);
        throw new Error(error);
    })

    redisClient.connect();
    return redisClient;
}


const redisClient: RedisClientType = initializeRedis();


export default redisClient;