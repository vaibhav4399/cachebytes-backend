import { createServer, Server } from "http";
import app from "./app";
import { PORT } from "./config/environment";


//** Create the HTTP Server */

const server: Server = createServer(app);

//** Start the server */

server.listen(PORT, () => {
    console.log(`Server is listening on the port ${PORT}`);
});

//** Unhandled Rejection */

process.on('unhandledRejection', (reason, _promise) => {
    console.log(`An Unhandled Rejection Occured ${reason}`);
});

//** Unhandled Exception */

process.on('uncaughtException', (reason, _promise) => {
    console.log(`An unhandled Exception Occured ${reason}`);
});