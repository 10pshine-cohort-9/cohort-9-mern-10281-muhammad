import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import errorHandler from "./middlewares/error.middleware.js";
import logger from "./config/logger.js";
import notFound from "./middlewares/not-found.middleware.js";
import router from "./routes/index.js";

const app = express();

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

export default app;
