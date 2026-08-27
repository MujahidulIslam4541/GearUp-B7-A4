import cookieParser from "cookie-parser";
import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import { gearRoutes } from "./modules/gear/gear.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { categoryRoutes } from "./modules/category/category.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { orderRoutes } from "./modules/rentalOrder/rental.routes";
import { reviewRoutes } from "./modules/review/review.routes";



const app: Application = express();

app.use(
    cors({
        origin: config.app_url,
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
});

app.use("/api/auth", authRoutes)
app.use("/api/gear", gearRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/order", orderRoutes)
app.use("/api",reviewRoutes)


export default app;
