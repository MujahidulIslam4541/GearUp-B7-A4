import app from "./app";
import config from "./config";
import { prisma } from "./lib";



async function main() {
    try {
        await prisma.$connect();
        console.log("connected prisma orm");

        app.listen(config.port, () => {
            console.log(`server is running on ${config.port}`);
        });
    } catch (error) {
        console.log("server error ", error);
        await prisma.$disconnect()
        process.exit(1);
    }
}
main();
