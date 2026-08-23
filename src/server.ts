import app from "./app";


const port = 5000

async function main() {
    try {

        app.listen(port, () => {
            console.log(`server is running on ${port}`);
        });
    } catch (error) {
        console.log("server error ", error);
        // await prisma.$disconnect()
        // process.exit(1);
    }
}
main();
