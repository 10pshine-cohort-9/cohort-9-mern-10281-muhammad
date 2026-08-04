import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import logger from "./config/logger.js";

connectDB(env.MONGO_URI);

app.listen(env.PORT, () => {
  logger.info(`Server started at port ${env.PORT}`);
});
