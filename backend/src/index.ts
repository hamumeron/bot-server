import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
