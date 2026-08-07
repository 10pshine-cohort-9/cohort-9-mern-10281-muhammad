import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import logger from "./config/logger.js";

async function start() {
  try {
    await connectDB(env.MONGO_URI);

    app.listen(env.PORT, () => {
      logger.info(`Server started at port ${env.PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Server startup failed.");
    process.exit(1);
  }
}

void start();
