import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";


const __dirname = path.resolve();

export function attachRouterWriteLogger(app, routerPath, router, logFileName)  {
    const logStream = fs.createWriteStream(
        path.join(__dirname, './Src/Logs', logFileName),
        { flags: 'a' }
    );
    app.use(routerPath, morgan("combined", { stream: logStream }), router); 

    app.use(routerPath, morgan("dev"), router); 
}